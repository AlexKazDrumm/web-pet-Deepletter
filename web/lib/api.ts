import { TOOL_CATALOG, type Tool, toolListResponseSchema } from '@deepletter/shared';
import { serverApiBaseUrl } from './config';

export interface ToolsResult {
  tools: Tool[];
  degraded: boolean;
}

export async function getTools(): Promise<ToolsResult> {
  try {
    const res = await fetch(`${serverApiBaseUrl}/api/tools`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API ответил ${res.status}`);
    }
    const data = toolListResponseSchema.parse(await res.json());
    return { tools: data.tools, degraded: false };
  } catch {
    return { tools: [...TOOL_CATALOG], degraded: true };
  }
}
