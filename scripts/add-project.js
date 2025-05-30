#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ruta al archivo JSON de proyectos
const projectsFilePath = path.join(__dirname, '..', 'src', 'data', 'projects.json');

// Función para leer los proyectos existentes
function readProjects() {
  try {
    const projectsData = fs.readFileSync(projectsFilePath, 'utf8');
    return JSON.parse(projectsData);
  } catch (error) {
    console.error('Error al leer el archivo de proyectos:', error.message);
    return [];
  }
}

// Función para guardar los proyectos
function saveProjects(projects) {
  try {
    fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
    console.log('✅ Proyecto guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar el proyecto:', error.message);
  }
}

// Función para preguntar por las tecnologías
function askForTechnologies(callback) {
  rl.question('Ingresa las tecnologías utilizadas (separadas por comas): ', (answer) => {
    const technologies = answer.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    callback(technologies);
  });
}

// Función principal para agregar un proyecto
function addProject() {
  console.log('📁 Agregar nuevo proyecto al portfolio');
  console.log('-------------------------------------');

  // Leer los proyectos existentes
  const projects = readProjects();

  // Objeto para almacenar los datos del nuevo proyecto
  const newProject = {};

  // Preguntar por el título del proyecto
  rl.question('Título del proyecto: ', (title) => {
    newProject.title = title;

    // Preguntar por la descripción
    rl.question('Descripción del proyecto: ', (description) => {
      newProject.description = description;

      // Preguntar por las tecnologías
      askForTechnologies((technologies) => {
        newProject.technologies = technologies;

        // Preguntar por la URL de GitHub
        rl.question('URL del repositorio de GitHub: ', (githubUrl) => {
          newProject.githubUrl = githubUrl || '#';

          // Preguntar por la URL del proyecto en vivo
          rl.question('URL del proyecto en vivo: ', (liveUrl) => {
            newProject.liveUrl = liveUrl || '#';

            // Preguntar por la URL de la imagen
            rl.question('URL de la imagen del proyecto: ', (imageUrl) => {
              newProject.imageUrl = imageUrl || 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

              // Agregar el nuevo proyecto al inicio de la lista
              projects.unshift(newProject);

              // Guardar los proyectos actualizados
              saveProjects(projects);

              // Mostrar resumen del proyecto agregado
              console.log('\n✨ Proyecto agregado:');
              console.log('---------------------');
              console.log(`Título: ${newProject.title}`);
              console.log(`Tecnologías: ${newProject.technologies.join(', ')}`);
              console.log(`GitHub: ${newProject.githubUrl}`);
              console.log(`Demo: ${newProject.liveUrl}`);
              
              // Preguntar si desea agregar otro proyecto
              rl.question('\n¿Deseas agregar otro proyecto? (s/n): ', (answer) => {
                if (answer.toLowerCase() === 's') {
                  addProject();
                } else {
                  console.log('¡Gracias! Tus proyectos han sido actualizados.');
                  rl.close();
                }
              });
            });
          });
        });
      });
    });
  });
}

// Iniciar el proceso
addProject();

// Manejar el cierre de la interfaz
rl.on('close', () => {
  console.log('\n🚀 Recuerda reiniciar el servidor de desarrollo para ver los cambios.');
  process.exit(0);
});
