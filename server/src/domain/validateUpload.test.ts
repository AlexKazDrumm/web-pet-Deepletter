import { describe, expect, it } from 'vitest';
import { detectFormat, validateUpload, verifySignature } from './validateUpload';
import { AppError } from '../errors';

const docxHead = Buffer.concat([
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  Buffer.from('....[Content_Types].xml....'),
]);

describe('detectFormat', () => {
  it('распознаёт разрешённые расширения', () => {
    expect(detectFormat('a.docx', '')).toBe('docx');
    expect(detectFormat('a.txt', 'text/plain')).toBe('txt');
    expect(detectFormat('notes.MD', 'text/markdown')).toBe('md');
    expect(detectFormat('notes.markdown', '')).toBe('md');
  });

  it('отклоняет посторонние расширения', () => {
    expect(() => detectFormat('malware.exe', '')).toThrow(AppError);
    expect(() => detectFormat('archive.zip', '')).toThrow(/не поддерживается/);
    expect(() => detectFormat('noext', '')).toThrow(AppError);
  });

  it('отклоняет несовпадение MIME и расширения', () => {
    expect(() => detectFormat('a.txt', 'image/png')).toThrow(/не соответствует/);
  });

  it('допускает application/octet-stream', () => {
    expect(detectFormat('a.docx', 'application/octet-stream')).toBe('docx');
  });
});

describe('verifySignature', () => {
  it('пропускает docx с сигнатурой ZIP и [Content_Types].xml', () => {
    expect(() => verifySignature('docx', docxHead)).not.toThrow();
  });

  it('отклоняет docx без ZIP-сигнатуры', () => {
    expect(() => verifySignature('docx', Buffer.from('plain text, not a zip'))).toThrow(
      /ZIP-контейнер/,
    );
  });

  it('отклоняет пустой буфер', () => {
    expect(() => verifySignature('txt', Buffer.alloc(0))).toThrow(/пустой/);
  });

  it('отклоняет текст с нулевыми байтами', () => {
    expect(() => verifySignature('txt', Buffer.from([0x41, 0x00, 0x42]))).toThrow(/нулевые байты/);
  });

  it('отклоняет не-UTF-8 текст', () => {
    expect(() => verifySignature('txt', Buffer.from([0xff, 0xfe, 0xfd]))).toThrow(/UTF-8/);
  });

  it('пропускает валидный UTF-8 с кириллицей', () => {
    expect(() => verifySignature('md', Buffer.from('# Привет\nмир', 'utf-8'))).not.toThrow();
  });
});

describe('validateUpload', () => {
  it('возвращает формат и буфер для корректного txt', () => {
    const buffer = Buffer.from('немного текста', 'utf-8');
    expect(validateUpload('note.txt', 'text/plain', buffer)).toEqual({ format: 'txt', buffer });
  });
});
