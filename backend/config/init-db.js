import sequelize from './database.js';

export const initDatabase = async () => {
  try {
    // Sync all models with the database
    // Only force: true in development when you want to recreate tables
    // Use alter: true only when you need to modify existing tables
    await sequelize.sync({ alter: false });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}; 