
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Auto-reload on ChunkLoadError (caused by new deployments)
        if (error.message.includes("dynamically imported module") || error.name === "ChunkLoadError") {
            // Prevent infinite loop if reload fails repeatedly
            const lastReload = sessionStorage.getItem("last_chunk_reload")
            if (!lastReload || Date.now() - parseInt(lastReload) > 10000) {
                sessionStorage.setItem("last_chunk_reload", Date.now().toString())
                window.location.reload()
            }
        }
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="border-red-500/20 bg-red-500/5 m-4">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="bg-red-500/10 p-3 rounded-full">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-500">Component Crashed</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                                {this.state.error?.message || "An unexpected error occurred."}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="gap-2"
                        >
                            <RefreshCcw className="h-4 w-4" /> Try Reloading
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}
