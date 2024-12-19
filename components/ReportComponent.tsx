import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent, useState } from "react"
import SocialMediaLinks from './social-links'
import { useToast } from "@/components/ui/use-toast"
import { FileText, Upload } from "lucide-react"

type Props = {
    onReportConfirmation: (data: string) => void
}

const ReportComponent = ({ onReportConfirmation }: Props) => {
    const [base64Data, setBase64Data] = useState<string>("")
    const [reportData, setReportData] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleReportSelection = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            // Convert file to base64
            const reader = new FileReader()
            reader.onload = async (e) => {
                const base64 = e.target?.result as string
                setBase64Data(base64)
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error("Error reading file:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to read the file. Please try again.",
            })
        }
    }

    const extractDetails = async () => {
        if (!base64Data) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/extract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: base64Data,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to extract text")
            }

            const data = await response.json()
            setReportData(data.text)
        } catch (error) {
            console.error("Error extracting text:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to extract text from the report. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
            <fieldset className='relative space-y-4 rounded-lg border p-4'>
                <legend className="text-sm font-medium">Upload Medical Report</legend>
                
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 text-center">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="size-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium">Upload your report</h3>
                        <p className="text-xs text-muted-foreground">
                            Support for JPG, PNG, and PDF files
                        </p>
                    </div>
                    <input
                        type="file"
                        onChange={handleReportSelection}
                        className="w-full cursor-pointer opacity-0 absolute inset-0"
                        accept=".jpg,.jpeg,.png,.pdf"
                    />
                </div>

                {base64Data && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
                            <div className="size-10 rounded bg-primary/10 flex items-center justify-center">
                                <FileText className="size-5 text-primary" />
                            </div>
                            <div className="flex-1 truncate text-sm">Report uploaded</div>
                            <Button
                                onClick={extractDetails}
                                disabled={isLoading}
                                size="sm"
                                className="ml-auto"
                            >
                                {isLoading ? (
                                    <div className="size-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                                ) : (
                                    "Process"
                                )}
                            </Button>
                        </div>
                        
                        {reportData && (
                            <div className="space-y-4">
                                <div className="rounded-lg border bg-card p-4">
                                    <h4 className="mb-2 text-sm font-medium">Report Summary</h4>
                                    <p className="text-sm text-muted-foreground">{reportData}</p>
                                </div>
                                <Button 
                                    className="w-full"
                                    onClick={() => onReportConfirmation(reportData)}
                                >
                                    Confirm Report
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </fieldset>
        </div>
    )
}

export default ReportComponent