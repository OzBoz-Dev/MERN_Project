import { designTokens } from "@/app/GlobalTheme"
import { useState } from "react";
import ProjectTag from "./ProjectTag";
import DatePostedBox from "./DatePostedBox";
import TagComboBox from "./TagComboBox";


type AdvancedSettingsProp = {
    tags: string[];
    setTags: (tags: string[]) => void;
};

export default function AdvancedSettings({tags, setTags}: AdvancedSettingsProp) {
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
                width:"100%",    
                gap:"24px",
                alignItems:"flex-start"
            }}>
                <div style = {{
                    flexDirection:"column",
                    alignItems:"left",
                    display:"flex",
                    flex: 1
                    }}>
                    <h2>
                        Tags
                    </h2>
                    <TagComboBox selectedTags={tags} setTags={setTags} color={designTokens.colors.cardBackground} allowMissing={false}/>
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

                <div style={{flex: 1, minWidth: 0}}>
                    <h2>
                        Date Posted
                    </h2>
                    <DatePostedBox/>
                </div>

            </div>

        </div>
    )
}