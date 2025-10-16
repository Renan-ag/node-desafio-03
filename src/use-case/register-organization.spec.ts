import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterOrganizationUseCase } from './register-organization';
import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organization';
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists';
import { compare } from 'bcryptjs';


let organizationRepository: InMemoryOrganizationRepository;
let sut: RegisterOrganizationUseCase;

describe('Create Organization Use Case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository();
    sut = new RegisterOrganizationUseCase(organizationRepository);
  });

  it('should be able to register a new organization', async () => {
    const { organization } = await sut.execute({
      responsibleName: 'Thomas Andrade',
      address: 'Rua celio, 99',
      city: 'Maricá',
      email: 'teste@email.com',
      latitude: 0.123,
      longitude: 0.321,
      password: '123456',
      whatsapp: '00000000000',
      zipCode: '00000000'
    });

    expect(organization.id).toEqual(expect.any(String));
  });

  it('should not allow registration of two organizations with the same email', async () => {
    const email = 'teste@email.com';

    await sut.execute({
      responsibleName: 'Thomas Andrade',
      address: 'Rua celio, 99',
      city: 'Maricá',
      email: email,
      latitude: 0.123,
      longitude: 0.321,
      password: '123456',
      whatsapp: '00000000000',
      zipCode: '00000000'
    });

    await expect(() => sut.execute({
      responsibleName: 'Jefferson Andrade',
      address: 'Rua celio, 20',
      city: 'Maricá',
      email: email,
      latitude: 0.1314,
      longitude: 0.32421,
      password: '123456',
      whatsapp: '00000000000',
      zipCode: '00000000'
    })).rejects.toBeInstanceOf(OrganizationAlreadyExistsError);
  });

  it('should hash the organization is password on registration', async () => {
    const password = '123456';

    const { organization } = await sut.execute({
      responsibleName: 'Thomas Andrade',
      address: 'Rua celio, 99',
      city: 'Maricá',
      email: 'teste@email.com',
      latitude: 0.123,
      longitude: 0.321,
      password: password,
      whatsapp: '00000000000',
      zipCode: '00000000'
    });

    const isPasswordCorrectlyHashed = await compare(password, organization.password);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});