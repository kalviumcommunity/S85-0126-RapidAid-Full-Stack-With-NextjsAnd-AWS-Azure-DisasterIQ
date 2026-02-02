import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock prisma module used by the service
vi.mock('@/app/prisma/prisma', () => {
  return {
    prisma: {
      disaster: {
        findFirst: vi.fn(),
      },
      nGO: {
        findUnique: vi.fn(),
      },
      nGORequest: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});

import { NGORequestService } from '@/app/Service/ngoRequest_service';
import { prisma } from '@/app/prisma/prisma';

describe('NGORequestService.createRequest', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('creates a request when disaster and NGO exist and no duplicate', async () => {
    (prisma.disaster.findFirst as any).mockResolvedValue({ id: 'd1', governmentId: 'g1' });
    (prisma.nGO.findUnique as any).mockResolvedValue({ id: 'n1' });
    (prisma.nGORequest.findUnique as any).mockResolvedValue(null);
    const created = { id: 'r1', disasterId: 'd1', ngoId: 'n1', governmentId: 'g1', requestedById: 'u1' };
    (prisma.nGORequest.create as any).mockResolvedValue(created);

    const res = await NGORequestService.createRequest({ disasterId: 'd1', ngoId: 'n1', governmentId: 'g1', userId: 'u1' });

    expect(prisma.disaster.findFirst).toHaveBeenCalledWith({ where: { id: 'd1', governmentId: 'g1' } });
    expect(prisma.nGO.findUnique).toHaveBeenCalledWith({ where: { id: 'n1' } });
    expect(prisma.nGORequest.create).toHaveBeenCalled();
    expect(res).toEqual(created);
  });

  it('throws when duplicate request exists', async () => {
    (prisma.disaster.findFirst as any).mockResolvedValue({ id: 'd1', governmentId: 'g1' });
    (prisma.nGO.findUnique as any).mockResolvedValue({ id: 'n1' });
    (prisma.nGORequest.findUnique as any).mockResolvedValue({ id: 'r1' });

    await expect(
      NGORequestService.createRequest({ disasterId: 'd1', ngoId: 'n1', governmentId: 'g1', userId: 'u1' })
    ).rejects.toThrow('NGO already requested for this disaster');
  });
});
