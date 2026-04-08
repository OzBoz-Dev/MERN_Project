import { designTokens } from "@/app/GlobalTheme"
import { useState } from "react";
import TagBox from "./TagBox";
import ProjectTag from "./ProjectTag";
import DatePostedBox from "./DatePostedBox";

export default function AdvancedSettings() {
    const [tags, setTags] = useState<string[]>([]);
    return (
        <div
            style={{
            borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
            borderRadius: designTokens.borderRadius.card,
            padding: designTokens.spacing.cardPadding,
            margin: "16px 0",
            boxShadow: designTokens.colors.cardShadow,
            background: designTokens.colors.glassyBackground,
            position: "relative",
            }}
        >
            <h1>Advanced Settings</h1>
            <div style={{
                display:"flex",
                justifyContent: "space-between",
                width:"50%",    
                alignItems:"flex-start"
            }}>
                <div style = {{
                    flexDirection:"column",
                    alignItems:"left",
                    display:"flex",
                    }}>
                    <h2>
                        Tags
                    </h2>
                    <TagBox tags={tags} setTags={setTags}></TagBox>
                    
                    <div style={{
                        display:"flex", 
                        flexWrap:"wrap",
                        marginTop:"8px",
                        }}>
                    {tags.length === 0 ? (
                        <></>
                    ) : (
                        tags.map((tag, idx) => (
                            <ProjectTag key={tag+idx}
                            tag={tag}
                            isRemovable={true}
                            onRemove={() => setTags(tags.filter(t => t !== tag))}
                            >

                            </ProjectTag>
                        ))
                    )}
                    </div>
                </div>

                <div>
                    <h2>
                        Date Posted
                    </h2>
                    <DatePostedBox/>
                </div>

            </div>

        </div>
    )
}