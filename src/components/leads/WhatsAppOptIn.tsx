/**
 * WhatsApp Opt-In Component
 * 
 * Collects explicit consent for WhatsApp messaging (Meta policy requirement)
 */

import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Collapse,
  Alert,
  Link,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { recordOptIn, type WhatsAppOptIn as OptInRecord } from '../../utils/whatsapp';

interface WhatsAppOptInProps {
  leadId: string;
  onOptIn?: (optIn: OptInRecord) => void;
  defaultChecked?: boolean;
}

export default function WhatsAppOptIn({ leadId, onOptIn, defaultChecked = false }: WhatsAppOptInProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);

    if (isChecked) {
      // Record opt-in
      const optIn: OptInRecord = {
        leadId,
        consentSource: 'form',
        consentTimestamp: new Date(),
        notes: 'Opted in via lead form',
      };

      try {
        await recordOptIn(optIn);
        setShowConfirmation(true);
        
        // Call parent callback
        if (onOptIn) {
          onOptIn(optIn);
        }

        // Hide confirmation after 3 seconds
        setTimeout(() => setShowConfirmation(false), 3000);
      } catch (error) {
        console.error('[WhatsApp] Failed to record opt-in:', error);
        setChecked(false);
      }
    }
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            icon={<WhatsAppIcon />}
            checkedIcon={<WhatsAppIcon color="success" />}
          />
        }
        label={
          <Box>
            <Typography variant="body2" component="span">
              I agree to receive WhatsApp messages
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              We'll send you updates, reminders, and follow-ups via WhatsApp. You can opt out anytime.{' '}
              <Link href="#" underline="hover">
                Learn more
              </Link>
            </Typography>
          </Box>
        }
      />

      <Collapse in={showConfirmation}>
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{ mt: 1 }}
          onClose={() => setShowConfirmation(false)}
        >
          WhatsApp notifications enabled! We'll keep you updated.
        </Alert>
      </Collapse>
    </Box>
  );
}

