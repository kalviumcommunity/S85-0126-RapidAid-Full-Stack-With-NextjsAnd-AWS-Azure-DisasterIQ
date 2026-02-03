import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the repository used by the service
vi.mock('@/app/repositories/volunteerAdmin.repository', () => {
  return {
    VolunteerAdminRepository: {
      findPendingByNgo: vi.fn(),
      findById: vi.fn(),
      approveRole: vi.fn(),
      rejectRole: vi.fn(),
    },
  };
});

import { VolunteerAdminService } from '@/app/Service/volunteerAdmin_service';
import { VolunteerAdminRepository } from '@/app/repositories/volunteerAdmin.repository';

const mockVolunteer = {
  id: 'vol-1',
  userId: 'user-1',
  ngoId: 'ngo-1',
  verified: false,
  rolePreference: 'MEDICAL' as any,
  joinedAt: new Date(),
  user: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
};

describe('VolunteerAdminService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('lists pending role preference requests (paginated)', async () => {
    (VolunteerAdminRepository.findPendingByNgo as any).mockResolvedValue({ items: [mockVolunteer], count: 1 });

    const res = await VolunteerAdminService.listRoleRequests('ngo-1', 1, 10);

    expect(VolunteerAdminRepository.findPendingByNgo).toHaveBeenCalledWith('ngo-1', 0, 10);
    expect(res.count).toBe(1);
    expect(res.items[0].id).toBe('vol-1');
  });

  it('approves volunteer role successfully', async () => {
    (VolunteerAdminRepository.findById as any).mockResolvedValue(mockVolunteer);
    const updated = { ...mockVolunteer, role: 'MEDICAL_VOLUNTEER', verified: true };
    (VolunteerAdminRepository.approveRole as any).mockResolvedValue(updated);

    const admin = { id: 'admin-1', ngoId: 'ngo-1', role: 'NGO_ADMIN' };

    const res = await VolunteerAdminService.approveRole('vol-1', 'MEDICAL_VOLUNTEER', admin as any);

    expect(VolunteerAdminRepository.findById).toHaveBeenCalledWith('vol-1');
    expect(VolunteerAdminRepository.approveRole).toHaveBeenCalledWith('vol-1', 'MEDICAL_VOLUNTEER', 'admin-1');
    expect(res.role).toBe('MEDICAL_VOLUNTEER');
    expect(res.verified).toBe(true);
  });

  it('rejects approve when approvedRole is invalid', async () => {
    (VolunteerAdminRepository.findById as any).mockResolvedValue(mockVolunteer);
    const admin = { id: 'admin-1', ngoId: 'ngo-1', role: 'NGO_ADMIN' };

    await expect(VolunteerAdminService.approveRole('vol-1', 'INVALID_ROLE', admin as any)).rejects.toThrow();
  });

  it('forbids admin approving themselves', async () => {
    const selfVolunteer = { ...mockVolunteer, userId: 'admin-1' };
    (VolunteerAdminRepository.findById as any).mockResolvedValue(selfVolunteer);
    const admin = { id: 'admin-1', ngoId: 'ngo-1', role: 'NGO_ADMIN' };

    await expect(VolunteerAdminService.approveRole('vol-1', 'MEDICAL_VOLUNTEER', admin as any)).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('rejects role request successfully', async () => {
    (VolunteerAdminRepository.findById as any).mockResolvedValue(mockVolunteer);
    const updated = { ...mockVolunteer, rolePreference: null, role: 'GROUND_VOLUNTEER' };
    (VolunteerAdminRepository.rejectRole as any).mockResolvedValue(updated);

    const admin = { id: 'admin-1', ngoId: 'ngo-1', role: 'NGO_ADMIN' };

    const res = await VolunteerAdminService.rejectRole('vol-1', admin as any);

    expect(VolunteerAdminRepository.findById).toHaveBeenCalledWith('vol-1');
    expect(VolunteerAdminRepository.rejectRole).toHaveBeenCalledWith('vol-1', 'admin-1');
    expect(res.rolePreference).toBeNull();
    expect(res.role).toBe('GROUND_VOLUNTEER');
  });

  it('reject role when no rolePreference present', async () => {
    const noPref = { ...mockVolunteer, rolePreference: null };
    (VolunteerAdminRepository.findById as any).mockResolvedValue(noPref);
    const admin = { id: 'admin-1', ngoId: 'ngo-1', role: 'NGO_ADMIN' };

    await expect(VolunteerAdminService.rejectRole('vol-1', admin as any)).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
