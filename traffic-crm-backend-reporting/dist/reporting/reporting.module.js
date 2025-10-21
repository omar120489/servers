"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const reporting_controller_1 = require("./reporting.controller");
const reporting_service_1 = require("./reporting.service");
let ReportingModule = class ReportingModule {
};
exports.ReportingModule = ReportingModule;
exports.ReportingModule = ReportingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'SALES_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: 4001,
                    },
                },
                {
                    name: 'COST_IMPORTER_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: 4004,
                    },
                },
            ]),
        ],
        controllers: [reporting_controller_1.ReportingController],
        providers: [reporting_service_1.ReportingService],
    })
], ReportingModule);
//# sourceMappingURL=reporting.module.js.map