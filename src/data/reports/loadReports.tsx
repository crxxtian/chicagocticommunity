type Report = {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  tags?: string[];
  author?: string;
  readTime?: string;
  downloads?: number;
};

export const loadReports = async (): Promise<Report[]> => {
  const modules = import.meta.glob("./*.tsx"); // 👈 This must be declared correctly!

  const reports: Report[] = [];

  for (const path in modules) {
    const mod = await modules[path]() as { default: Report };
    reports.push(mod.default);
  }

  return reports.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
