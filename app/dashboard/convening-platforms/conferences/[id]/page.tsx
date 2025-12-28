import React from "react";
import Link from "next/link";

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

export default function ConferenceViewPage({ params }) {
    const conf = conferences.find(c => c.id === params.id);
    if (!conf) return <div className="p-8">Conference not found.</div>;
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={conf.image} alt={conf.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{conf.edition}</span>
                <span className="text-xs text-gray-500">{conf.date}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{conf.title}</h1>
            <p className="text-gray-700 mb-4">{conf.excerpt}</p>
            <div className="flex flex-wrap gap-1 mb-2">
                {conf.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{tag}</span>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-gray-400">By {conf.author}</span>
                <Link href={`/dashboard/convening-platforms/conferences/${conf.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
