import { createNote, getNotes, deleteNote, getArchivedNotes, archiveNote, unarchiveNote } from "./api.js";

async function render(type = "notes") {
    let notes;
    if (type === "notes") {
        notes = await getNotes();
    } else if (type === "archived") {
        notes = await getArchivedNotes();
    }

    let cards = "";
    for (let note of notes.data) {
        cards += noteCards(note);
    }
    document.querySelector(".card-list").innerHTML = cards;

    // Event listener untuk tombol delete
    const deleteBtn = document.querySelectorAll(".delete-btn");
    deleteBtn.forEach(del => {
        del.addEventListener("click", async (e) => {
            e.preventDefault();
            const isConfirmed = window.confirm("Apakah Anda ingin menghapus catatan ini?");

            if (isConfirmed) {
                await deleteNote(e.target.dataset.id);
                render(type);
            }
        });
    });

    // event listener untuk archive note
    const archiveBtn = document.querySelectorAll('.archive-btn');
    for (const btn of archiveBtn) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await archiveNote(e.target.dataset.id);
            render(type);
        })
    }

    // event listener untuk unarchive notes
    const unarchiveBtn = document.querySelectorAll('.unarchive-btn');
    for (const btn of unarchiveBtn) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await unarchiveNote(e.target.dataset.id);
            render(type)
        })
    }
}



function noteCards(note) {
    return `
        <div class="card">
            <h4>${note.title}</h4>
            <p>${note.body}</p>
            <small class="date">${new Date(note.createdAt).toLocaleString()}</small>
            <button class="${note.archived ? " unarchive-btn" : "archive-btn"}"
                data-id="${note.id}">${note.archived ? "Unarchive" : "Archive"}</button>
            <button class="delete-btn" data-id="${note.id}">Delete</button>
        </div>
    `
}

document.addEventListener("DOMContentLoaded", () => {
    render();

    // buat event listener untuk create note
    document.getElementById('input-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = document.querySelector('.input-title').value;
        const body = document.querySelector('.input-body').value;

        await createNote(title, body);
        form.reset()
        render("notes");
    })

    document.getElementById("notesDropdown").addEventListener("change", function () {
        const listTitle = document.getElementById("list-title");
        
        if (this.value === "notes") {
            listTitle.textContent = "List Notes";
            render("notes"); // Panggil render() untuk menampilkan Notes
        } else if (this.value === "archived") {
            listTitle.textContent = "List Archived Notes";
            render("archived"); // Panggil render() untuk menampilkan Archived Notes
        }
    });
})