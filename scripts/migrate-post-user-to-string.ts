import PostModel from '@/lib/models/post.model';
import { connect } from '@/lib/mongodb/mongoose';
import * as dotenvx from '@dotenvx/dotenvx';

dotenvx.config()

async function migratePostUserToString() {
  try {
    await connect();
    
    console.log('Starting migration: Converting user ObjectId to String...');
    
    // Find all posts where user is an ObjectId (not a string)
    const posts = await PostModel.find({});
    
    let updatedCount = 0;
    
    for (const post of posts) {
      // Check if user is an ObjectId by checking if it's not a plain string
      if (post.user && typeof post.user !== 'string') {
        const userIdString = post.user.toString();
        await PostModel.updateOne(
          { _id: post._id },
          { $set: { user: userIdString } }
        );
        updatedCount++;
        console.log(`Updated post ${post._id}: user ${post.user} -> ${userIdString}`);
      }
    }
    
    console.log(`Migration completed! Updated ${updatedCount} posts.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migratePostUserToString();
