const searchContact = (contactList, term) => {
    if (term) {
        const matches = [];
        for (let contact of contactList) {
            if (contact.name.toLowerCase().includes(term.toLowerCase())) {
                matches.push(contact);
            }
        }
        return matches;
    } else {
        return contactList;
    }
};

export default searchContact;
