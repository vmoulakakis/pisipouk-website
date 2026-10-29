export type AtelierPattern={id:string;name:string;age:number;category:string;variant:number;svg:string};
const BASE=[
["Αρκουδάκι","Ζώα","bear"],["Πεταλούδα","Φύση","butterfly"],["Λουλούδι","Φύση","flower"],["Σπιτάκι","Κατασκευές","house"],["Ήλιος","Φύση","sun"],
["Γατούλα","Ζώα","cat"],["Ψαράκι","Ζώα","fish"],["Καραβάκι","Μεταφορές","boat"],["Δεντράκι","Φύση","tree"],["Συννεφάκι","Καιρός","cloud"],
["Πασχαλίτσα","Έντομα","ladybird"],["Πουλάκι","Ζώα","bird"],["Μανιτάρι","Φύση","mushroom"],["Μπαλόνι","Γιορτές","balloon"],["Αεροπλανάκι","Μεταφορές","plane"],
["Αστέρι","Σχήματα","star"],["Μηλαράκι","Διατροφή","apple"],["Χελωνάκι","Ζώα","turtle"],["Ουράνιο τόξο","Καιρός","rainbow"],["Πυραυλάκι","Διάστημα","rocket"]
] as const;
const shapes:Record<string,string>={
bear:'<circle cx="62" cy="69" r="22"/><circle cx="150" cy="69" r="22"/><circle cx="106" cy="125" r="73"/><ellipse cx="82" cy="122" rx="10" ry="14"/><ellipse cx="130" cy="122" rx="10" ry="14"/><ellipse cx="106" cy="159" rx="22" ry="15"/><path d="M106 150v12m0 0q-12 12-24 0m24 0q12 12 24 0"/>',
butterfly:'<path d="M105 130Q20 16 19 95Q10 170 102 161Q192 170 192 96Q187 16 108 130Z"/><ellipse cx="105" cy="134" rx="12" ry="67"/><path d="M98 73Q77 50 83 36M113 73Q135 50 129 36"/><circle cx="60" cy="102" r="17"/><circle cx="150" cy="102" r="17"/>',
flower:'<circle cx="105" cy="114" r="26"/><ellipse cx="105" cy="62" rx="22" ry="27"/><ellipse cx="105" cy="166" rx="22" ry="27"/><ellipse cx="53" cy="114" rx="27" ry="22"/><ellipse cx="157" cy="114" rx="27" ry="22"/><path d="M105 194v54m0-23Q51 176 62 241Q95 247 105 225M105 231Q160 174 164 244Q127 253 105 231"/>',
house:'<path d="M34 110L105 40L176 110V232H34Z"/><path d="M23 114L105 26L187 114"/><rect x="86" y="158" width="38" height="74" rx="2"/><rect x="48" y="130" width="27" height="27"/><rect x="138" y="130" width="27" height="27"/>',
sun:'<circle cx="105" cy="137" r="65"/><path d="M105 27v35M105 210v35M0 137h40M170 137h40M29 61l29 29M152 184l29 29M181 61l-29 29M58 184l-29 29"/><circle cx="82" cy="132" r="5"/><circle cx="128" cy="132" r="5"/><path d="M81 160q24 26 49 0"/>',
cat:'<path d="M32 95L32 40L76 69Q105 55 136 69L180 40V95Q192 182 106 199Q20 182 32 95Z"/><circle cx="80" cy="126" r="7"/><circle cx="131" cy="126" r="7"/><path d="M96 150h20l-10 11Zm10 11q-10 12-23 0m23 0q10 12 23 0M72 149L26 143M74 159L28 167M137 149L184 143M137 159L184 167"/>',
fish:'<path d="M30 137Q86 55 163 132L195 83V191L163 145Q87 224 30 137Z"/><circle cx="78" cy="126" r="7"/><path d="M112 113q22 20 0 41M85 92q24-38 57-6M85 176q26 26 55 2"/>',
boat:'<path d="M20 170H190L161 214H60Z"/><path d="M103 167V45L155 163H103M100 62L49 162H100"/><path d="M40 235q20-15 40 0t40 0t40 0"/>',
tree:'<path d="M83 240Q91 169 73 140H138Q119 179 130 240Z"/><path d="M105 42C35 10 20 83 45 113Q12 160 68 171Q108 206 139 166Q199 174 184 108Q207 57 148 51Q132 19 105 42Z"/>',
cloud:'<path d="M43 177Q8 166 22 128Q31 100 62 111Q59 65 103 65Q148 65 151 106Q193 93 193 144Q199 179 162 180Z"/><path d="M68 207v32m37-32v32m37-32v32"/>',
ladybird:'<ellipse cx="105" cy="153" rx="77" ry="88"/><path d="M105 68V241"/><circle cx="71" cy="119" r="11"/><circle cx="141" cy="119" r="11"/><circle cx="70" cy="178" r="11"/><circle cx="142" cy="178" r="11"/><path d="M70 67q-15-32-37-22m107 22q15-32 37-22"/>',
bird:'<path d="M37 163Q35 64 124 79Q174 91 170 147L197 158L170 174Q115 226 53 186Z"/><path d="M74 163q38-65 72-13q-23 43-72 13"/><circle cx="133" cy="113" r="6"/><path d="M89 196v31m29-30v31"/>',
mushroom:'<path d="M43 114Q35 52 105 48Q175 52 167 114Z"/><path d="M81 114v120h48V114"/><circle cx="82" cy="83" r="10"/><circle cx="126" cy="78" r="12"/><path d="M85 182q20 22 40 0"/>',
balloon:'<ellipse cx="106" cy="104" rx="65" ry="81"/><path d="M95 186l11 19l11-19M106 205q-30 17 0 38q30 16 0 35"/>',
plane:'<path d="M18 139L88 118L102 47Q107 27 113 47L128 118L195 139V158L128 154L117 201L145 220V232L107 221L68 232V220L96 201L88 154L18 158Z"/>',
star:'<path d="M105 35L126 104L196 104L140 146L161 213L105 171L49 213L70 146L14 104L84 104Z"/><circle cx="91" cy="138" r="4"/><circle cx="120" cy="138" r="4"/>',
apple:'<path d="M105 83Q62 42 32 91Q0 161 56 215Q82 237 106 219Q132 237 155 215Q210 160 177 91Q146 42 105 83Z"/><path d="M105 79Q105 44 121 34M108 51Q153 12 162 45Q146 66 108 51Z"/>',
turtle:'<ellipse cx="103" cy="143" rx="69" ry="58"/><circle cx="174" cy="131" r="30"/><ellipse cx="49" cy="196" rx="22" ry="12"/><ellipse cx="144" cy="196" rx="22" ry="12"/><path d="M45 148l-24 10L37 177M103 85v117M40 142h125M71 103l65 81M132 104l-62 81"/><circle cx="184" cy="121" r="4"/>',
rainbow:'<path d="M15 214A90 90 0 0 1 195 214M32 214A73 73 0 0 1 178 214M50 214A55 55 0 0 1 160 214M68 214A37 37 0 0 1 142 214"/><path d="M10 214q-8-37 24-31q30-25 43 31ZM134 214q18-40 40-22q36-8 32 22Z"/>',
rocket:'<path d="M73 202V115Q73 62 105 30Q137 62 137 115V202Z"/><circle cx="105" cy="109" r="24"/><path d="M73 148L38 180V218L73 202M137 148l35 32v38l-35-16M89 207l-13 37m29-37v48m17-48l13 37"/>'
};

function artFor(key:string,variant:number,age:number){
 const ornament=variant%4;
 const extra=ornament===0?'':ornament===1?'<circle cx="37" cy="243" r="7"/><circle cx="173" cy="243" r="7"/>':ornament===2?'<path d="M23 244l14-15l14 15m108 0l14-15l14 15"/>':'<path d="M27 242q16-12 32 0m92 0q16-12 32 0"/>';
 const deco=age===0?'':age===1?'<circle cx="39" cy="36" r="5"/><circle cx="169" cy="35" r="5"/>':age===2?'<path d="M30 45l14-14l14 14m95 0l14-14l14 14"/>':'<path d="M18 48Q40 20 62 48M148 48Q170 20 192 48"/>';
 return '<g fill="white" stroke="#202b30" stroke-width="'+(age===0?2.7:1.8)+'" stroke-linecap="round" stroke-linejoin="round">'+shapes[key]+extra+deco+'</g>';
}
export function pageSvg(name:string,key:string,variant:number,age:number){
 return '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297"><rect width="210" height="297" fill="white"/><g transform="translate(0 9)">'+artFor(key,variant,age)+'</g><path d="M15 270h180" stroke="#777" stroke-width=".4"/><text x="105" y="279" text-anchor="middle" font-family="Arial,sans-serif" font-size="4.5" fill="#29313d">ΠΙΣΙΠΟΥΚ · '+name.replace(/&/g,'&amp;')+' · Α4</text><text x="105" y="287" text-anchor="middle" font-family="Arial,sans-serif" font-size="3.5" fill="#777">Χρωματίζω · Εκτυπώνω · Κόβω με έναν μεγάλο</text></svg>';
}
export const ALL_PATTERNS:AtelierPattern[]=Array.from({length:4},(_,age)=>BASE.map(([name,category,key],i)=>({id:'age'+age+'-'+key,name:name+(age===0?'':age===1?' · μικρές λεπτομέρειες':age===2?' · δημιουργία':' · πρόκληση'),age,category,variant:age,svg:pageSvg(name,key,age,age)}))).flat();
