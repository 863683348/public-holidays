import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * 按需 ISR 重新验证路由（Fast Origin Transfer 优化配套）
 * POST /api/revalidate
 *
 * 背景：各页 revalidate 已延长到 604800（每周），日常不再每日无脑重生。
 * 仅当上游假期数据（nager.at）真的变更、需要立刻刷新时，才由脚本/手动调用本路由。
 *
 * Body: { secret: string, paths?: string[] }
 * - secret: 与 REVALIDATE_SECRET 环境变量匹配
 * - paths:  可选，指定要重新验证的路径（如 ["/en/US", "/en/US/2026"]）。
 *           不传时默认只刷新首页与 sitemap（廉价、总是有益的壳页）。
 */
const DEFAULT_PATHS = ["/", "/sitemap.xml"];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      secret?: string;
      paths?: string[];
    };

    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { error: "REVALIDATE_SECRET not configured on server" },
        { status: 500 },
      );
    }
    if (body.secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const paths =
      body.paths && body.paths.length > 0 ? body.paths : DEFAULT_PATHS;

    const results: { path: string; revalidated: boolean }[] = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, revalidated: true });
      } catch {
        results.push({ path, revalidated: false });
      }
    }

    const allOk = results.every((r) => r.revalidated);
    return NextResponse.json(
      {
        revalidated: allOk,
        paths: results,
        timestamp: new Date().toISOString(),
      },
      { status: allOk ? 200 : 500 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Revalidation failed", message },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({
    status: "ready",
    message: "POST to this endpoint with { secret } to trigger ISR revalidation",
  });
}
