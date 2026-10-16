import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="min-h-screen bg-black pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-muted-foreground mb-8">This page is currently under construction.</p>
            <Link to="/">
                <Button>Return Home</Button>
            </Link>
        </div>
    )
}
