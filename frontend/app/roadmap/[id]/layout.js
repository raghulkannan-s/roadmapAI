

export const metadata = {
  title: "Roadmaps",
  description: "AI-powered roadmap planning and insights",
};

export default function RoadmapLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
