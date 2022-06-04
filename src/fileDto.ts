import { ApiProperty } from '@nestjs/swagger';

export class fileDto {
  @ApiProperty({ description: 'filename' })
  name!: string;

  @ApiProperty({ description: 'content' })
  body!: string;
}
