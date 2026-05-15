// ── Backend API ─────────────────────────────────────────
const API_URL =
    '/api/notes';

// ── State ───────────────────────────────────────────────
let notes = [];

let selectedColor = {
    color: '#eeeeff',
    border: '#c5c6f5'
};

let activeFilter = 'all';

// ── Init ────────────────────────────────────────────────
document.addEventListener(
    'DOMContentLoaded',
    async () => {

        await fetchNotes();

        // Add Note button
        document
            .getElementById(
                'addBtn'
            )
            .addEventListener(
                'click',
                addNote
            );

        // Search input
        document
            .getElementById(
                'searchInput'
            )
            .addEventListener(
                'input',
                filterNotes
            );

        // Color picker
        document
            .querySelectorAll(
                '.color-dot'
            )
            .forEach(dot => {

                dot.addEventListener(
                    'click',
                    function () {

                        document
                            .querySelectorAll(
                                '.color-dot'
                            )
                            .forEach(d =>
                                d.classList
                                    .remove(
                                        'active'
                                    )
                            );

                        this.classList
                            .add(
                                'active'
                            );

                        selectedColor = {

                            color:
                                this.dataset
                                    .color,

                            border:
                                this.dataset
                                    .border
                        };
                    }
                );
            });
        document
            .getElementById(
                'titleInput'
            )
            .addEventListener(
                'keydown',
                (e) => {

                    if (e.key === 'Enter') {

                        e.preventDefault();

                        document
                            .getElementById(
                                'contentInput'
                            )
                            .focus();
                    }
                }
            );

        document
            .getElementById(
                'sortSelect'
            )
            .addEventListener(
                'change',
                () => {

                    renderNotes();
                }
            );

        document
            .getElementById(
                'contentInput'
            )
            .addEventListener(
                'keydown',
                (e) => {

                    if (
                        (e.ctrlKey ||
                            e.metaKey) &&
                        e.key === 'Enter'
                    ) {

                        addNote();
                    }
                }
            );
    });


// ── Fetch Notes ─────────────────────────────────────────
async function fetchNotes() {

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        notes =
            data.map(note => ({

                id: note.id,

                title:
                    note.title,

                content:
                    note.content,

                tag:
                    note.category
                    || 'General',

                color:
                    note.color
                    || '#eeeeff',

                border:
                    note.border
                    || '#c5c6f5',

                pinned:
                    false,

                date:
                    note.created_at
                    || new Date()
            }));

        buildFilters();
        renderNotes();

    } catch (error) {

        console.error(error);

        toast(
            'Failed to load notes'
        );
    }
}

// ── Character Counter ───────────────────────────────────
function updateCharCount() {

    const len =
        document
            .getElementById(
                'contentInput'
            )
            .value.length;

    document
        .getElementById(
            'charCount'
        )
        .textContent =
        len + ' / 500';
}

// ── Color Picker ────────────────────────────────────────
function selectColor(el) {

    document
        .querySelectorAll(
            '.color-dot'
        )
        .forEach(d =>
            d.classList
                .remove('active')
        );

    el.classList
        .add('active');

    selectedColor = {

        color:
            el.dataset.color,

        border:
            el.dataset.border
            || el.dataset.color
    };
}

// ── Toast ───────────────────────────────────────────────
function toast(msg) {

    const t =
        document
            .getElementById(
                'toast'
            );

    t.textContent =
        msg;

    t.classList
        .add('show');

    setTimeout(() => {

        t.classList
            .remove('show');

    }, 2200);
}

// ── Add Note ────────────────────────────────────────────
async function addNote() {

    const title =
        document
            .getElementById(
                'titleInput'
            )
            .value.trim();

    const content =
        document
            .getElementById(
                'contentInput'
            )
            .value.trim();

    const tag =
        document
            .getElementById(
                'tagInput'
            )
            .value.trim()
        || 'General';

    if (!title &&
        !content) {

        toast(
            '✦ Please add title or content'
        );

        return;
    }

    const btn =
        document
            .getElementById(
                'addBtn'
            );

    btn.classList
        .add('saving');

    btn.textContent =
        'Adding…';

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({

                            title:
                                title ||
                                'Untitled',

                            content,

                            category:
                                tag,

                            color:
                                selectedColor.color,

                            border:
                                selectedColor.border
                        })
                }
            );

        if (!response.ok) {

            throw new Error(
                'Failed'
            );
        }

        document
            .getElementById(
                'titleInput'
            ).value = '';

        document
            .getElementById(
                'contentInput'
            ).value = '';

        document
            .getElementById(
                'tagInput'
            ).value = '';

        updateCharCount();

        await fetchNotes();

        toast(
            '✓ Note saved!'
        );

    } catch (error) {

        console.error(
            error
        );

        toast(
            'Failed to save note'
        );

    } finally {

        btn.classList
            .remove(
                'saving'
            );

        btn.textContent =
            '+ Add Note';
    }
}

// ── Delete Note ─────────────────────────────────────────
async function deleteNote(id) {

    try {

        await fetch(
            `${API_URL}/${id}`,
            {
                method:
                    'DELETE'
            }
        );

        await fetchNotes();

        toast(
            'Note deleted'
        );

    } catch (error) {

        console.error(
            error
        );

        toast(
            'Delete failed'
        );
    }
}

// ── Pin / Unpin ─────────────────────────────────────────
function togglePin(id) {

    const note =
        notes.find(
            n => n.id === id
        );

    if (!note) return;

    note.pinned =
        !note.pinned;

    // move pinned note to top
    notes.sort(
        (a, b) =>
            b.pinned -
            a.pinned
    );

    renderNotes();

    toast(
        note.pinned
            ? '📌 Note pinned'
            : 'Unpinned'
    );
}
// ── Expand Card ─────────────────────────────────────────
function toggleExpand(id) {

    const card =
        document
            .getElementById(
                'card-' + id
            );

    const content =
        document
            .getElementById(
                'content-' + id
            );

    const expanded =
        card.classList
            .toggle(
                'expanded'
            );

    if (expanded) {

        content
            .classList
            .add('full');

    } else {

        content
            .classList
            .remove('full');
    }
}

// ── Filters ─────────────────────────────────────────────
function buildFilters() {

    const tags =
        [...new Set(
            notes.map(
                n => n.tag
            )
        )];

    const container =
        document
            .getElementById(
                'filterBtns'
            );

    container.innerHTML = '';

    // All button
    const allBtn =
        document
            .createElement(
                'button'
            );

    allBtn.className =
        `filter-btn ${activeFilter === 'all'
            ? 'active'
            : ''
        }`;

    allBtn.textContent =
        'All';

    allBtn.addEventListener(
        'click',
        () => {

            activeFilter =
                'all';

            buildFilters();
            renderNotes();
        }
    );

    container
        .appendChild(
            allBtn
        );

    // Dynamic tags
    tags.forEach(tag => {

        const btn =
            document
                .createElement(
                    'button'
                );

        btn.className =
            `filter-btn ${activeFilter === tag
                ? 'active'
                : ''
            }`;

        btn.textContent =
            tag;

        btn.addEventListener(
            'click',
            () => {

                activeFilter =
                    tag;

                buildFilters();
                renderNotes();
            }
        );

        container
            .appendChild(
                btn
            );
    });
}
// ── Search ──────────────────────────────────────────────
async function filterNotes() {

    const keyword =
        document
            .getElementById(
                'searchInput'
            )
            .value
            .trim();

    try {

        if (!keyword) {

            await fetchNotes();
            return;
        }

        const response =
            await fetch(
                `${API_URL}/search/${keyword}`
            );

        const data =
            await response
                .json();

        notes =
            data.map(note => ({

                id: note.id,
                title: note.title,
                content:
                    note.content,

                tag:
                    note.category
                    || 'General',

                color:
                    '#eeeeff',

                border:
                    '#c5c6f5',

                pinned:
                    false,

                date:
                    note.created_at
            }));

        renderNotes();

    } catch (error) {

        toast(
            'Search failed'
        );
    }
}

// ── Sort ────────────────────────────────────────────────
function getSorted(arr) {

    const mode =
        document
            .getElementById(
                'sortSelect'
            )
            ?.value || 'newest';

    const copy = [...arr];

    switch (mode) {

        case 'newest':

            copy.sort(
                (a, b) =>
                    new Date(
                        b.date
                    ) -
                    new Date(
                        a.date
                    )
            );
            break;

        case 'oldest':

            copy.sort(
                (a, b) =>
                    new Date(
                        a.date
                    ) -
                    new Date(
                        b.date
                    )
            );
            break;

        case 'title':

            copy.sort(
                (a, b) =>
                    (a.title || '')
                        .toLowerCase()
                        .localeCompare(
                            (b.title || '')
                                .toLowerCase()
                        )
            );
            break;

        case 'pinned':

            copy.sort(
                (a, b) => {

                    // pinned first
                    if (
                        b.pinned !==
                        a.pinned
                    ) {

                        return (
                            Number(
                                b.pinned
                            ) -
                            Number(
                                a.pinned
                            )
                        );
                    }

                    // newest among pinned
                    return (
                        new Date(
                            b.date
                        ) -
                        new Date(
                            a.date
                        )
                    );
                }
            );
            break;

        default:
            break;
    }

    return copy;
}

// ── Time Ago ────────────────────────────────────────────
function timeAgo(iso) {

    const diff =
        (Date.now()
            - new Date(iso))
        / 1000;

    if (diff < 60)
        return 'just now';

    if (diff < 3600)
        return Math.floor(
            diff / 60
        ) + 'm ago';

    if (diff < 86400)
        return Math.floor(
            diff / 3600
        ) + 'h ago';

    return Math.floor(
        diff / 86400
    ) + 'd ago';
}

// ── Render Notes ────────────────────────────────────────
function renderNotes() {

    let filtered =
        notes.filter(n => {

            const match =
                activeFilter
                === 'all'
                ||
                n.tag
                === activeFilter;

            return match;
        });

    filtered =
        getSorted(
            filtered
        );

    document
        .getElementById(
            'noteCount'
        )
        .textContent =
        notes.length +
        ' notes';

    document
        .getElementById(
            'visibleCount'
        )
        .textContent =
        filtered.length +
        ' shown';

    const grid =
        document
            .getElementById(
                'notesGrid'
            );

    if (
        !filtered.length
    ) {

        grid.innerHTML =
            `<div class="empty-state">
<p>No notes found</p>
<small>Add a note</small>
</div>`;

        return;
    }

    grid.innerHTML =
        filtered.map(n => `

<div class="note-card"
id="card-${n.id}"
style="
background:${n.color};
border-color:${n.border};
">

${n.pinned
                ? '<div class="pinned-badge">Pinned</div>'
                : ''}

<div class="note-card-header">

<div class="note-title">
${escHtml(n.title)}
</div>

<div class="note-actions">

<button
class="action-btn pin
${n.pinned ? 'pinned' : ''}"
data-id="${n.id}">

📌
</button>

<button
class="action-btn del delete-btn"
data-id="${n.id}">

🗑
</button>

</div>
</div>

<div class="note-content"
id="content-${n.id}">
${escHtml(n.content)}
</div>

<div class="note-footer">

<span class="note-tag">
${escHtml(n.tag)}
</span>

<span class="note-date">
${timeAgo(n.date)}
</span>

</div>
</div>

`).join('');

    // Expand note card
    document
        .querySelectorAll(
            '.note-card'
        )
        .forEach(card => {

            card.addEventListener(
                'click',
                () => {

                    const id =
                        Number(
                            card.id
                                .replace(
                                    'card-',
                                    ''
                                )
                        );

                    toggleExpand(id);
                }
            );
        });

    // Pin button
    document
        .querySelectorAll(
            '.pin'
        )
        .forEach(btn => {

            btn.addEventListener(
                'click',
                (e) => {

                    e.stopPropagation();

                    togglePin(
                        Number(
                            btn.dataset.id
                        )
                    );
                }
            );
        });

    // Delete button
    document
        .querySelectorAll(
            '.delete-btn'
        )
        .forEach(btn => {

            btn.addEventListener(
                'click',
                async (e) => {

                    e.stopPropagation();

                    await deleteNote(
                        Number(
                            btn.dataset.id
                        )
                    );
                }
            );
        });
}

// ── Helpers ─────────────────────────────────────────────
function escHtml(str) {

    return String(str)
        .replace(/&/g,
            '&amp;')
        .replace(/</g,
            '&lt;')
        .replace(/>/g,
            '&gt;')
        .replace(/"/g,
            '&quot;')
        .replace(/'/g,
            '&#39;');
}

function escAttr(str) {

    return String(str)
        .replace(
            /'/g,
            "\\'"
        );
}