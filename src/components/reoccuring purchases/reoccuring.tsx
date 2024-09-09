import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



export default function Reoccuring() {
    const purchases = []
    const calculateOpacity = (index: number, totalItems: number): number => {
        const middleIndex = Math.floor(totalItems / 2); // Calculate the middle index
        
        const distanceFromMiddle = Math.abs(index - middleIndex); // How far the item is from the middle
        const maxDistance = Math.floor(totalItems / 2); // Max possible distance from the middle
        
        // Linearly decrease opacity based on the distance from the middle
        const opacity = 1 - (distanceFromMiddle / maxDistance);
        
        return opacity;
      };


    for (let index = 0; index < 7; index++) {
        purchases.push(<>
            <div className="flex flex-col items-center justify-center mx-5" style={{ opacity: calculateOpacity(index, 7) }}>
                <Avatar className="mb-5">
                    <AvatarImage src="https://githdub.com/shadcn.png" />
                    <AvatarFallback>Ai</AvatarFallback>
                </Avatar>
                <span className="" >$ <span className="text-red-600">27.98</span></span>
                <span>Adobe inc</span>
            </div>
        </>)

    }

    return (
        <>

            {purchases }

        </>
    )
}