"use client";
import React, { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import Link from "next/link";
import { getPhotosVideos, deletePhotoVideo } from "@/services/photosVideosService";


type Photo = {
    _id: string;
    title: string;
    description: string;
    type: string;
};

export default function PhotoGalleryList() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchPhotos = async (): Promise<void> => {
        setLoading(true);
        const data = await getPhotosVideos();
        setPhotos(Array.isArray(data) ? data.filter((item: any) => item.type === 'photo') : []);
        setLoading(false);
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this photo?')) {
            await deletePhotoVideo(id);
            fetchPhotos();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Photo Gallery</h1>
                <Link href="/dashboard/press/photo-gallery/new">
                    <Button>Add New</Button>
                </Link>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((item) => (
                        <Card key={item._id} className="p-4">
                            <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                            <p className="mb-4">{item.description}</p>
                            <div className="flex gap-2">
                                <Link href={`/dashboard/press/photo-gallery/${item._id}`}><Button>View</Button></Link>
                                <Link href={`/dashboard/press/photo-gallery/${item._id}/edit`}><Button>Edit</Button></Link>
                                <Button variant="destructive" onClick={() => handleDelete(item._id)}>Delete</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
