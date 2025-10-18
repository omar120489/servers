#!/bin/bash

# Comprehensive Smoke Test Suite
# ===============================
# Tests all critical paths for the CRM integration

set -e  # Exit on error

API_URL="${API_URL:-http://localhost:8000/api/v1}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Traffic CRM - Comprehensive Smoke Test    ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo ""
echo "API URL: $API_URL"
echo "Timestamp: $(date)"
echo ""

# Helper: Test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local expected_code=${5:-200}
    
    echo -n "  Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code, expected $expected_code)"
        echo "    Response: $body" | head -c 200
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Helper: Validate JSON structure
validate_pagination() {
    local response=$1
    local name=$2
    
    echo -n "  Validating: $name pagination structure... "
    
    has_items=$(echo "$response" | jq -e '.items' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_total=$(echo "$response" | jq -e '.total' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_page=$(echo "$response" | jq -e '.page' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_size=$(echo "$response" | jq -e '.size' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_pages=$(echo "$response" | jq -e '.pages' > /dev/null 2>&1 && echo "yes" || echo "no")
    
    if [ "$has_items" = "yes" ] && [ "$has_total" = "yes" ] && [ "$has_page" = "yes" ] && [ "$has_size" = "yes" ] && [ "$has_pages" = "yes" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "    Missing fields: items=$has_items total=$has_total page=$has_page size=$has_size pages=$has_pages"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}1️⃣  Health & Connectivity${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

test_endpoint "GET" "/health" "Health check endpoint"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}2️⃣  Contacts - Full CRUD Cycle${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

# List contacts
response=$(curl -sf "$API_URL/contacts?page=1&size=25" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "  Testing: List contacts... ${GREEN}✓ PASS${NC}"
    PASSED=$((PASSED + 1))
    validate_pagination "$response" "Contacts"
else
    echo -e "  Testing: List contacts... ${RED}✗ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Create contact
echo -n "  Testing: Create contact... "
create_response=$(curl -sf -X POST "$API_URL/contacts" \
    -H "Content-Type: application/json" \
    -d '{"first_name":"Ada","last_name":"Lovelace","email":"ada@example.com","phone":"+1-555-0100"}' 2>/dev/null)

if [ $? -eq 0 ]; then
    CID=$(echo "$create_response" | jq -r '.id' 2>/dev/null)
    if [ -n "$CID" ] && [ "$CID" != "null" ]; then
        echo -e "${GREEN}✓ PASS${NC} (ID: $CID)"
        PASSED=$((PASSED + 1))
        
        # Update contact
        echo -n "  Testing: Update contact... "
        update_response=$(curl -sf -X PATCH "$API_URL/contacts/$CID" \
            -H "Content-Type: application/json" \
            -d '{"title":"Software Engineer"}' 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ PASS${NC}"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ FAIL${NC}"
            FAILED=$((FAILED + 1))
        fi
        
        # Delete contact
        echo -n "  Testing: Delete contact... "
        delete_response=$(curl -sf -X DELETE "$API_URL/contacts/$CID" 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ PASS${NC}"
            PASSED=$((PASSED + 1))
        else
            echo -e "${RED}✗ FAIL${NC}"
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (No ID returned)"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${RED}✗ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}3️⃣  Companies (Alias Test)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

response=$(curl -sf "$API_URL/companies?page=1&size=25" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "  Testing: List companies... ${GREEN}✓ PASS${NC}"
    PASSED=$((PASSED + 1))
    validate_pagination "$response" "Companies"
else
    echo -e "  Testing: List companies... ${YELLOW}⚠ WARNING${NC} (Alias may not be configured)"
    WARNINGS=$((WARNINGS + 1))
fi

test_endpoint "POST" "/companies" "Create company" \
    '{"name":"Acme Corp","industry":"Technology","website":"https://acme.com"}' 201 || true

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}4️⃣  Deals & Stage Validation${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

response=$(curl -sf "$API_URL/deals?page=1&size=25" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "  Testing: List deals... ${GREEN}✓ PASS${NC}"
    PASSED=$((PASSED + 1))
    validate_pagination "$response" "Deals"
    
    # Check stages
    echo -n "  Validating: Deal stages... "
    stages=$(echo "$response" | jq -r '.items[].stage' 2>/dev/null | sort -u)
    expected_stages="prospecting qualification proposal negotiation closed_won closed_lost"
    
    valid_stages=true
    while IFS= read -r stage; do
        if [ -n "$stage" ] && ! echo "$expected_stages" | grep -q "$stage"; then
            valid_stages=false
            echo -e "${YELLOW}⚠ WARNING${NC} (Unexpected stage: $stage)"
            WARNINGS=$((WARNINGS + 1))
            break
        fi
    done <<< "$stages"
    
    if [ "$valid_stages" = true ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED=$((PASSED + 1))
    fi
else
    echo -e "  Testing: List deals... ${YELLOW}⚠ WARNING${NC} (Alias may not be configured)"
    WARNINGS=$((WARNINGS + 1))
fi

test_endpoint "POST" "/deals" "Create deal" \
    '{"name":"Big Deal","stage":"prospecting","amount":50000,"probability":25}' 201 || true

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}5️⃣  Activities${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

response=$(curl -sf "$API_URL/activities?page=1&size=25" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "  Testing: List activities... ${GREEN}✓ PASS${NC}"
    PASSED=$((PASSED + 1))
    validate_pagination "$response" "Activities"
else
    echo -e "  Testing: List activities... ${RED}✗ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

test_endpoint "POST" "/activities" "Create activity" \
    '{"type":"call","subject":"Follow up call","due_date":"2024-12-01"}' 201 || true

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}6️⃣  Search & Filtering${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

test_endpoint "GET" "/contacts?page=1&size=25&search=test" "Search contacts"
test_endpoint "GET" "/deals?page=1&size=25&stage=prospecting" "Filter deals by stage"
test_endpoint "GET" "/activities?page=1&size=25&type=call" "Filter activities by type"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

total=$((PASSED + FAILED + WARNINGS))

echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASSED"
echo -e "  ${RED}Failed:${NC}   $FAILED"
echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "  Total:    $total"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ All critical tests passed!                 ║${NC}"
    echo -e "${GREEN}║  Your backend is ready for the frontend.      ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}Note: $WARNINGS warning(s) detected. Check alias routes if needed.${NC}"
    fi
    
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ Some tests failed.                         ║${NC}"
    echo -e "${RED}║  Please fix the errors above.                  ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Common fixes:"
    echo "  1. Ensure CORS allows http://localhost:3000"
    echo "  2. Check pagination format: {items, total, page, size, pages}"
    echo "  3. Verify alias routes are included"
    echo "  4. Check FastAPI logs for errors"
    exit 1
fi


