"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const reporting_module_1 = require("./reporting/reporting.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        const app = await core_1.NestFactory.create(reporting_module_1.ReportingModule);
        app.enableCors({ origin: '*', credentials: false });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: false,
        }));
        const portEnv = process.env.PORT;
        const port = portEnv ? Number(portEnv) : 8005;
        if (Number.isNaN(port)) {
            throw new Error(`Invalid PORT value "${portEnv}"`);
        }
        const host = process.env.HOST || '127.0.0.1';
        await app.listen(port, host);
        const url = await app.getUrl();
        logger.log(`🚀 Reporting service listening on ${url}`);
    }
    catch (err) {
        common_1.Logger.error('Failed to bootstrap reporting service', err);
        process.exitCode = 1;
    }
}
bootstrap();
//# sourceMappingURL=main.js.map