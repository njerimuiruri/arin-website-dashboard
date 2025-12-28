import { notFound } from "next/navigation";

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

export default function DialogueDetailsPage({ params }) {
    const dialogue = dialogues.find((d) => d.id === params.id);
    if (!dialogue) return notFound();
    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{dialogue.title}</h1>
            <div className="text-sm text-muted-foreground mb-1">{dialogue.date} &bull; {dialogue.year}</div>
            <div className="mb-4 text-base">{dialogue.excerpt}</div>
            <div className="mb-4 flex flex-wrap gap-2">
                {dialogue.tags.map((tag) => (
                    <span key={tag} className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">{tag}</span>
                ))}
            </div>
            <div className="mb-4 text-xs font-medium text-green-600">Status: {dialogue.status}</div>
            <a href={`/dashboard/convening-platforms/policy-dialogues/${dialogue.id}/edit`} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Edit Dialogue</a>
        </div>
    );
}
