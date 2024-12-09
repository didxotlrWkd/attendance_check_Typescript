import { Module } from '@nestjs/common';
import { ExcelService } from './exel.service';


@Module({
    exports : [ExcelService],
    providers : [ExcelService]
})
export class UtilModule {}
