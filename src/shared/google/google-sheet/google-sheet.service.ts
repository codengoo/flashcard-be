import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { GoogleApiService } from '../google-api/google-api.service';
import {
  DataDirective,
  ICellValue,
  IDataValue,
  IMappingPattern,
} from './interfaces';

@Injectable()
export class GoogleSheetService {
  private readonly logger = new Logger(GoogleSheetService.name);
  constructor(private readonly googleApiService: GoogleApiService) {}

  public async getClient(accessToken?: string) {
    const authClient = await this.googleApiService.getGoogleClient(accessToken);
    const googleSheetApi = google.sheets({ version: 'v4', auth: authClient });
    return googleSheetApi;
  }

  private buildRowValues(
    headers: string[],
    mapping: readonly IMappingPattern[],
    data: IDataValue,
    initValue?: ICellValue[],
  ) {
    const _header = headers.map((h) => h.toLowerCase().trim());
    // Không có gtri ban đầu thì tạo mảng rỗng
    const vals = initValue ?? Array.from({ length: headers.length }, () => '');
    if (data === DataDirective.BLANK) return vals;

    Object.entries(data).forEach(([key, value]) => {
      const colName = mapping
        .find((m) => m.key.toLowerCase().trim() === key.toLowerCase().trim())
        ?.field?.toLowerCase()
        .trim();

      if (!colName) return;
      const colIndex = _header.indexOf(colName);
      vals[colIndex] = value;
    });

    return vals;
  }

  private buildMapping(
    headers: string[],
    row: string[],
    mapping: readonly IMappingPattern[],
  ) {
    return Object.fromEntries(
      mapping.map(({ field, key }) => [
        key,
        row[headers.indexOf(field.toLowerCase().trim())] ?? null,
      ]),
    ) as Record<(typeof mapping)[number]['key'], string | null>;
  }

  // Core
  public async getData(
    sheetsApi: sheets_v4.Sheets,
    sheetId: string,
    range: string,
    headerHeight: number = 1,
    raw: boolean = false,
  ) {
    const values = await this.getDataRaw(sheetsApi, sheetId, range, raw);
    const headers = values[headerHeight - 1].map(
      (header) => header?.toString().toLowerCase().trim() || '',
    );
    const rows = values
      .slice(headerHeight)
      .map((row) =>
        row
          .concat(Array(Math.abs(headers.length - row.length)).fill(''))
          .slice(0, headers.length),
      );
    return { headers, rows, headerRows: values.slice(0, headerHeight) };
  }

  public async getDataRaw(
    sheetsApi: sheets_v4.Sheets,
    sheetId: string,
    range: string,
    raw: boolean = false,
  ) {
    try {
      const response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
        valueRenderOption: raw ? 'FORMULA' : 'FORMATTED_VALUE',
      });
      const values = (response.data.values || [[]]) as string[][];
      return values;
    } catch (error) {
      this.logger.error('Error fetching sheet data:', (error as Error).message);
      throw error;
    }
  }

  public async getDataDetail(
    sheetsApi: sheets_v4.Sheets,
    sheetId: string,
    range: string,
  ) {
    const response = await sheetsApi.spreadsheets.get({
      spreadsheetId: sheetId,
      ranges: [range],
      includeGridData: true,
    });
    const sheet = response.data.sheets?.[0];
    const gridData = sheet?.data?.[0];
    const rowData = gridData?.rowData ?? [];

    const raws: any[][] = [];
    const formatted: any[][] = [];

    for (const row of rowData) {
      const formulaRow: any[] = [];
      const valueRow: any[] = [];

      for (const cell of row.values ?? []) {
        // ---- formula (userEnteredValue) ----
        const uev = cell.userEnteredValue;
        const formulaValue = String(
          uev?.formulaValue ??
            uev?.stringValue ??
            uev?.numberValue ??
            uev?.boolValue ??
            '',
        );

        // ---- formatted value (sau khi calc) ----
        const formattedValue = cell.formattedValue ?? '';

        formulaRow.push(formulaValue);
        valueRow.push(formattedValue);
      }

      raws.push(formulaRow);
      formatted.push(valueRow);
    }

    return { raws, formatted };
  }

  public async insertData(
    sheetsApi: sheets_v4.Sheets,
    spreadsheetId: string,
    range: string,
    values: ICellValue[][],
  ) {
    await sheetsApi.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }

  public async updateData(
    sheetsApi: sheets_v4.Sheets,
    spreadsheetId: string,
    range: string,
    values: ICellValue[][],
  ) {
    await sheetsApi.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }

  // Pattern
  public async getDataPattern(
    sheets: sheets_v4.Sheets,
    sheetId: string,
    range: string,
    mapping: readonly IMappingPattern[],
  ): Promise<Record<(typeof mapping)[number]['key'], string | null>[]> {
    const { headers, rows } = await this.getData(sheets, sheetId, range);
    return rows.map((row) => this.buildMapping(headers, row, mapping));
  }

  public async insertDataPattern<T extends IDataValue>(
    sheets: sheets_v4.Sheets,
    sheetId: string,
    range: string,
    mapping: readonly IMappingPattern[],
    values: (Partial<T> | DataDirective)[],
  ) {
    const { headers } = await this.getData(sheets, sheetId, range);
    const vals = values.map((value) =>
      this.buildRowValues(headers, mapping, value as any),
    );
    await this.insertData(sheets, sheetId, range, vals);
  }

  // Utils
  public async getSheetList(sheetApi: sheets_v4.Sheets, spreadsheetId: string) {
    try {
      const response = await sheetApi.spreadsheets.get({
        spreadsheetId,
        includeGridData: false,
      });

      return (
        response.data.sheets?.map((sheet) => ({
          title: sheet.properties?.title || '',
          sheetId: sheet.properties?.sheetId || 0,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching sheet list:', (error as Error).message);
      throw error;
    }
  }
}
