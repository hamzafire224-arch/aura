import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
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
                <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8 text-center border rounded-xl bg-background/50 backdrop-blur-sm">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold">Something went wrong</h2>
                    <p className="text-muted-foreground max-w-md">
                        We encountered an unexpected error. The AI might be overwhelmed or there's a connection issue.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </Button>
                        <Button
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            Try Again
                        </Button>
                    </div>
                    {this.state.error && (
                        <pre className="mt-4 max-w-lg overflow-auto rounded bg-muted p-4 text-xs text-left">
                            {this.state.error.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
