import { ApiProperty } from "@nestjs/swagger";

export class EventDto {
    @ApiProperty({ description: '이벤트 코드', example: 'hdhdfhd' })
    event_code: string;
  
    @ApiProperty({ description: '이벤트 이름', example: 'hdhdfh' })
    event_name: string;
  
    @ApiProperty({ description: '이벤트 설명', example: 'dhdfh' })
    description: string;
  
    @ApiProperty({ description: '이벤트 위치', example: 'dfhdfhdfh' })
    location: string;
  
    @ApiProperty({
      description: '이벤트 시작 시간',
      example: '2024-12-07T15:40:00.000Z',
    })
    event_start_time: Date;
  
    @ApiProperty({
      description: '이벤트 종료 시간',
      example: '2024-12-07T15:43:00.000Z',
    })
    event_end_time: Date;
  
    @ApiProperty({
      description: '이벤트 참가자 목록',
    })
    participants : boolean
  }
  
  export class EventListResponseDto {
    @ApiProperty({
      description: '이벤트 목록',
      type: [EventDto],
    })
    events: EventDto[];
  }