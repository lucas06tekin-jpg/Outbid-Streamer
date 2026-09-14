import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { formatOre } from "@/lib/format";
import { approveAction, rejectAction, deleteAction, logoutAction } from "./actions";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  const streamers = await prisma.streamer.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const pending = streamers.filter((s) => s.status === "PENDING");
  const paid = streamers.filter((s) => s.status === "PAID");
  const rejected = streamers.filter((s) => s.status === "REJECTED");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin</h1>
        <form action={logoutAction}>
          <button className="text-sm text-muted hover:text-foreground">Logga ut</button>
        </form>
      </div>

      <Group title={`Aktiva (${paid.length})`} streamers={paid} showReject showDelete />
      <Group title={`Väntar på granskning (${pending.length})`} streamers={pending} showApprove showDelete />
      <Group title={`Avvisade (${rejected.length})`} streamers={rejected} showApprove showDelete />
    </div>
  );
}

function Group({
  title,
  streamers,
  showApprove,
  showReject,
  showDelete,
}: {
  title: string;
  streamers: Awaited<ReturnType<typeof prisma.streamer.findMany>>;
  showApprove?: boolean;
  showReject?: boolean;
  showDelete?: boolean;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">{title}</h2>
      {streamers.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Inga listningar här.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {streamers.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{s.name}</p>
                <p className="truncate text-xs text-muted">
                  {s.platform} · {s.url} · {s.email} · {formatOre(s.currentBid)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {showApprove && (
                  <form action={approveAction.bind(null, s.id)}>
                    <button className="rounded-md bg-surface-2 px-3 py-1.5 text-xs hover:bg-border">
                      Godkänn
                    </button>
                  </form>
                )}
                {showReject && (
                  <form action={rejectAction.bind(null, s.id)}>
                    <button className="rounded-md bg-surface-2 px-3 py-1.5 text-xs hover:bg-border">
                      Avvisa
                    </button>
                  </form>
                )}
                {showDelete && (
                  <form action={deleteAction.bind(null, s.id)}>
                    <button className="rounded-md bg-red-950/40 border border-red-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/70">
                      Radera (GDPR)
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
