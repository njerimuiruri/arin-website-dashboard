"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const conferences = [
    {
        id: 'arin-conference-2024',
        title: '2024 : THE 4TH ANNUAL ARIN INTERNATIONAL CONFERENCE – BRIDGING KNOWLEDGE GAPS: INTEGRATING DISCIPLINES FOR CLIMATE AND HEALTH RESILIENCE',
        date: 'July 29, 2024',
        year: '2024',
        author: 'Awino',
        excerpt: 'The 4th International Conference has organized by the Africa Research and Impact Network (ARIN). ARIN is a consortium of over 200 researchers and policymakers with national focal points across…',
        tags: ['ARIN International conference', 'Conferences', 'Climate', 'Health Resilience'],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        edition: '4th Annual'
    },
    {
        id: 'arin-conference-2022',
        title: '2022: "REBUILDING BETTER AND RESILIENT COMMUNITIES THROUGH A JUST TRANSITION FOR AFRICA -WHAT DOES COP 27 OFFER? "',
        date: 'July 22, 2024',
        year: '2022',
        author: 'Awino',
        excerpt: 'Introduction The World is on the verge of and amid several transitions structured by major social, economic, and environmental disruptions including climate change, COVID-19, and knowledge shifts. These disruptions are…',
        tags: ['ARIN International conference', 'Just Transition', 'COP27', 'Resilience'],
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
        edition: '2022 Conference'
    },
    {
        id: 'arin-conference-2020',
        title: "2020: INTERNATIONAL REFLECTIVE CONFERENCE 2021 ON 'EVIDENCE- DRIVEN SUSTAINABLE RECOVERY FROM GLOBAL INTRACTABLE CHALLENGES'",
        date: 'July 22, 2024',
        year: '2020',
        author: 'Awino',
        excerpt: "Click here to register for the conference END YEAR INTERNATIONAL REFLECTIVE CONFERENCE 'EVIDENCE - DRIVEN SUSTAINABLE RECOVERY FROM GLOBAL INTRACTABLE CHALLENGES' on 25th, 26th and 29th November 2021. As the world reconfigures its efforts towards addressing the changing nature of global challenges such…",
        tags: ['ARIN International conference', 'Sustainable Recovery', 'Global Challenges'],
        image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
        edition: '2020/2021 Conference'
    }
];

export default function EditConferencePage({ params }) {
    const router = useRouter();
    const conf = conferences.find((c) => c.id === params.id);
    const [form, setForm] = useState(conf ? {
        title: conf.title,
        date: conf.date,
        year: conf.year,
        author: conf.author,
        excerpt: conf.excerpt,
        tags: conf.tags.join(", "),
        image: conf.image,
        edition: conf.edition
    } : {
        title: "",
        date: "",
        year: "",
        author: "",
        excerpt: "",
        tags: "",
        image: "",
        edition: ""
    });
    if (!conf) return <div className="p-8">Conference not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the conference
        router.push(`/dashboard/convening-platforms/conferences/${conf.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Conference</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. July 29, 2024)" className="w-full border rounded px-3 py-2" required />
                <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full border rounded px-3 py-2" required />
                <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <input name="edition" value={form.edition} onChange={handleChange} placeholder="Edition (e.g. 4th Annual)" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update Conference</button>
            </form>
        </div>
    );
}
