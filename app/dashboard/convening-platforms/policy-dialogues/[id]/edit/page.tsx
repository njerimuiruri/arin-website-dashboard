"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const dialogues = [
    {
        id: 'community-leaders-drr',
        title: 'Community Leaders Dialogues on Disaster Risk Reduction (DRR) and Gender Intersectionality under the Nairobi City Risk Hub, 2020',
        date: 'December 10, 2020',
        year: '2020',
        excerpt: 'The Nairobi Risk Hub Secretariat (African Centre for Technology Studies -ACTS), Nairobi City County Government…',
        tags: ['DRR', 'Gender', 'Urban Risk'],
        status: 'Completed'
    },
    {
        id: 'climate-finance-ndcs',
        title: 'Making Climate Finance Work for Africa: Using NDCs to Leverage Climate Finance for Innovation System Building',
        date: 'August 10, 2020',
        year: '2020',
        excerpt: 'The workshop was organized by the Africa Sustainability Hub (ASH), a networked research and knowledge…',
        tags: ['Climate Finance', 'NDCs', 'Innovation'],
        status: 'Completed'
    }
];

export default function EditDialoguePage({ params }) {
    const router = useRouter();
    const dialogue = dialogues.find((d) => d.id === params.id);
    const [form, setForm] = useState(dialogue ? {
        title: dialogue.title,
        date: dialogue.date,
        year: dialogue.year,
        excerpt: dialogue.excerpt,
        tags: dialogue.tags.join(", "),
        status: dialogue.status
    } : {
        title: "",
        date: "",
        year: "",
        excerpt: "",
        tags: "",
        status: "Completed"
    });
    if (!dialogue) return <div className="p-8">Dialogue not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the dialogue
        router.push(`/dashboard/convening-platforms/policy-dialogues/${dialogue.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Policy Dialogue</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. December 10, 2020)" className="w-full border rounded px-3 py-2" required />
                <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Update Dialogue</button>
            </form>
        </div>
    );
}
