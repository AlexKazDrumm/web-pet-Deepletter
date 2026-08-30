import type { Tool } from '@deepletter/shared';
import { query } from './pool';

export interface ToolsRepository {
  listTools(): Promise<Tool[]>;
}

interface ToolRow {
  slug: string;
  title: string;
  summary: string;
  category: string;
  href: string;
  sort_order: number;
}

function mapRow(row: ToolRow): Tool {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category: row.category,
    href: row.href,
    sortOrder: row.sort_order,
  };
}

export const pgToolsRepository: ToolsRepository = {
  async listTools() {
    const result = await query<ToolRow>(
      `SELECT slug, title, summary, category, href, sort_order
       FROM tools
       ORDER BY sort_order ASC, title ASC`,
    );
    return result.rows.map(mapRow);
  },
};
