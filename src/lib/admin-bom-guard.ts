import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

export async function toggleArchiveBom(id: string, shouldArchive?: boolean) {
  const bom = await prisma.bOMSubmission.findUnique({ where: { id } });
  if (!bom) throw new Error(`BOM submission with ID ${id} not found`);

  const nextArchivedState = shouldArchive !== undefined ? shouldArchive : !bom.isArchived;

  const updated = await prisma.bOMSubmission.update({
    where: { id },
    data: { isArchived: nextArchivedState }
  });

  return updated;
}

export async function purgeBomSubmission(id: string) {
  const bom = await prisma.bOMSubmission.findUnique({ where: { id } });
  if (!bom) throw new Error(`BOM submission with ID ${id} not found`);

  if (bom.fileUrl) {
    const relativePath = bom.fileUrl.startsWith('/') ? bom.fileUrl.slice(1) : bom.fileUrl;
    const fullPath = path.join(process.cwd(), 'public', relativePath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.warn(`Could not unlink file ${fullPath}:`, err);
      }
    }
  }

  await prisma.bOMSubmission.delete({ where: { id } });

  return { success: true, id, contractorName: bom.contractorName };
}

export async function purgeBomSubmissionsBulk(ids: string[]) {
  let purgedCount = 0;
  const results: any[] = [];

  for (const id of ids) {
    try {
      const res = await purgeBomSubmission(id);
      results.push(res);
      purgedCount++;
    } catch (err: any) {
      results.push({ success: false, id, error: err.message });
    }
  }

  return {
    success: true,
    total: ids.length,
    purgedCount,
    results
  };
}
