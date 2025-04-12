import { useState } from "react"
import { Copy } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const customStyle = {
  ...oneDark,
  'keyword': {
    ...oneDark.keyword,
    color: '#F97316',
  },
};

const SqlCodeContainer = ({ sqlCode, isLoading, error }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        if (sqlCode) {
            navigator.clipboard.writeText(sqlCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 5000)
        }
    }

    return (
        <div className="rounded-md p-4 text-white border border-gray-500">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-lg font-semibold">Generated SQL Code</h1>
                <button
                    onClick={handleCopy}
                    className="text-xs flex items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-1 cursor-pointer rounded-md transition-colors"
                >
                    <Copy size={16} />
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                </button>
            </div>

            <div className="max-h-[500px] overflow-auto rounded-md bg-transparent">
                {isLoading && <p className="text-gray-400">Generating SQL...</p>}
                {error && <p className="text-red-400">Error: {error.message}</p>}
                {!isLoading && !error && sqlCode && (
                    <SyntaxHighlighter
                        language="sql"
                        style={customStyle}
                        customStyle={{
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            margin: 0,
                            backgroundColor: "#111111", 
                        }}
                        className="sql-syntax-highlight"
                    >
                        {sqlCode}
                    </SyntaxHighlighter>
                )}
            </div>
        </div>
    )
}

export default SqlCodeContainer
