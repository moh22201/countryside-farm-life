import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "قريتي – المرحلة ١" },
      { name: "description", content: "لعبة قريتي التفاعلية" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#8fbf78",
      }}
    >
      <iframe
        title="قريتي – المرحلة ١"
        src="/village.html"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="fullscreen"
      />
    </main>
  );
}
