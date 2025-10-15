

export const metadata = {
  title: "Roadmaps",
  description: "AI-powered roadmap planning and insights",
};

export default function RoadmapLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen p-6">
        {children}
      </body>
    </html>
  );
}
