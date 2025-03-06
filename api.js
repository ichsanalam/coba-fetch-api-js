const BASE_URL = "https://notes-api.dicoding.dev/v2";

export async function getNotes() {
    try {
        const response = await fetch(BASE_URL + '/notes')
        return response.json();
    } catch (err) {
        console.log(err);
    }
}

export async function createNote(title, body) {
    try {
        const response = await fetch(BASE_URL + '/notes', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ title, body}),
        })
        return response.json();
    } catch (err) {
        console.log(err)
    } 
}

export async function deleteNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'DELETE',
        })
        return response.json();
    } catch(err) {
        console.log(err);
    }
}

export async function getArchivedNotes() {
    try {
        const response = await fetch(`${BASE_URL}/notes/archived`);
        return response.json()
    } catch(err) {
        console.log(err);
    }
}

export async function archiveNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
            method: 'POST',
        })
        return response.json();
    } catch(err) {
        console.log(err)
    }
}

export async function unarchiveNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
            method: 'POST',
        });
        return response.json();
    } catch(err) {
        console.log(err)
    }
}


