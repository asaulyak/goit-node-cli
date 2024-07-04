import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';

const contactsPath = join('db', 'contacts.json');

export async function listContacts() {
  try {
    const contacts = await readFile(contactsPath);

    return JSON.parse(contacts.toString());
  } catch (e) {
    console.error(`Could not list contacts from ${contactsPath}`, e);

    return [];
  }
}

export async function getContactById(contactId) {
  const contacts = await listContacts();

  return contacts.find(item => item.id === contactId) ?? null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();

  const contactToDelete = contacts.find(item => item.id === contactId);

  if (!contactToDelete) {
    return null;
  }

  const contactsAfterDelete = contacts.filter(contact => contact.id !== contactId);

  try {
    await storeContacts(contactsAfterDelete);
  } catch (e) {
    console.error(`Could not delete contact with id ${contactId}`, e);

    return null;
  }

  return contactToDelete;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(21),
    name,
    email,
    phone
  };

  try {
    await storeContacts([...contacts, newContact]);
  } catch (e) {
    console.error(`Could not add contact`, e);

    return null;
  }

  return newContact;
}

async function storeContacts(contacts) {
  try {
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');
  } catch (e) {
    console.error(`Could not store contacts`, e);
  }
}
