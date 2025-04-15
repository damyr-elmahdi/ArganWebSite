export default function ResourcesSection() {
   // Educational resources based on the Argan High School requirements
   const resources = [
     { id: 1, title: "Library Catalog", icon: "📚", link: "#" },
     { id: 2, title: "Mathematics", icon: "🔢", link: "#" },
     { id: 3, title: "Physics", icon: "⚛️", link: "#" },
     { id: 4, title: "Quiz Platform", icon: "✏️", link: "#" },
     { id: 5, title: "Student Portal", icon: "🖥️", link: "#" },
     { id: 6, title: "New Student Info", icon: "📋", link: "#" }
   ];
 
   return (
     <section className="py-12 bg-white">
       <div className="container mx-auto px-4">
         <h2 className="text-2xl font-bold text-gray-800 mb-8">Educational Resources</h2>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {resources.map(resource => (
             <a 
               key={resource.id}
               href={resource.link}
               className="bg-gray-50 p-4 rounded-lg text-center hover:bg-green-50 hover:shadow-md transition flex flex-col items-center"
             >
               <span className="text-3xl mb-2">{resource.icon}</span>
               <span className="font-medium text-gray-800">{resource.title}</span>
             </a>
           ))}
         </div>
       </div>
     </section>
   );
 }