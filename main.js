import { createNote, getNotes, deleteNote, getArchivedNotes, archiveNote, unarchiveNote } from "./api.js";

async function render(type = "notes", searchQuery = "") {
    let notes;
    if (type === "notes") {
        notes = await getNotes();
    } else if (type === "archived") {
        notes = await getArchivedNotes();
    }

    console.log(notes.data)

    // Filter berdasarkan input pencarian
    const filteredNotes = notes.data.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let cards = "";
    // Cek apakah hasil pencarian kosong
    if (filteredNotes.length === 0) {
        cards = `<p class="no-data">Data tidak ditemukan</p>`;
    } else {
        for (let note of filteredNotes) {
            cards += noteCards(note);
        }
    }
    document.querySelector(".card-list").innerHTML = cards;

    // Event listener untuk tombol delete
    const deleteBtn = document.querySelectorAll(".delete-btn");
    deleteBtn.forEach(del => {
        del.addEventListener("click", async (e) => {
            e.preventDefault();

            Swal.fire({
                title: "Apakah Anda ingin menghapus catatan ini?",
                text: "Catatan ini akan dihapus permanen!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteNote(e.target.dataset.id);
                    render(type, searchQuery);
                }
            });
        });
    });

    // Event listener untuk archive note
    const archiveBtn = document.querySelectorAll('.archive-btn');
    for (const btn of archiveBtn) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            Swal.fire({
                title: "Apakah Anda ingin mengarsipkan catatan ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, arsipkan!",
                cancelButtonText: "Batal"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await archiveNote(e.target.dataset.id);
                    render(type, searchQuery);
                }
            });
        });
    }

    // Event listener untuk unarchive notes
    const unarchiveBtn = document.querySelectorAll('.unarchive-btn');
    for (const btn of unarchiveBtn) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            Swal.fire({
                title: "Apakah Anda ingin mengembalikan catatan ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, kembalikan!",
                cancelButtonText: "Batal"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await unarchiveNote(e.target.dataset.id);
                    render(type, searchQuery);
                }
            });
        });
    }
}

// Fungsi untuk menampilkan kartu catatan
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
    `;
}

// Ketika halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    render();

    // Event listener untuk membuat catatan baru
    document.getElementById('input-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = document.querySelector('.input-title').value;
        const body = document.querySelector('.input-body').value;

        await createNote(title, body);
        form.reset();
        render("notes");
    });

    // Event listener untuk dropdown (Notes / Archived)
    document.getElementById("notesDropdown").addEventListener("change", function () {
        const listTitle = document.getElementById("list-title");

        if (this.value === "notes") {
            listTitle.textContent = "List Notes";
            render("notes");
        } else if (this.value === "archived") {
            listTitle.textContent = "List Archived Notes";
            render("archived");
        }
    });

    // Event listener untuk input pencarian
    document.querySelector('.input-search').addEventListener('input', function () {
        const searchQuery = this.value;
        const selectedType = document.getElementById("notesDropdown").value;
        render(selectedType, searchQuery);
    });
});
