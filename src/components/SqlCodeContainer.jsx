import { Copy } from "lucide-react"
const SqlCodeContainer = () => {

    return (
        <div className="border-1 rounded-md p-3">

            <div className="flex justify-between">
                <h1>Generated Sql Code</h1>
                <button className="text-xs flex justify-center items-center space-x-2 bg-gray-500 px-2 py-1 cursor-pointer rounded-md">
                    <Copy size={16}/>
                    <span>Copy Code</span>
                </button>
            </div>
            <div>

            </div>
        </div>
    );
}
export default SqlCodeContainer;