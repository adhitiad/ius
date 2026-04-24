type LocalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const users: LocalUser[] = [];

export async function findUserByEmail(email: string): Promise<LocalUser | null> {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function saveUser(payload: Omit<LocalUser, "id">): Promise<LocalUser> {
  const user: LocalUser = {
    id: crypto.randomUUID(),
    ...payload,
  };
  users.push(user);
  return user;
}
