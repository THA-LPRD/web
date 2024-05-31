'use client';
import { uploadFile } from "./upload";

export default function AssetForm({ user }: any) {

  return (
    <div>
      <h2>Create new Asset</h2>
      <form action={uploadFile}>
        <label htmlFor="friendly_name">Assetname</label>
        <input type="text" name="friendly_name"/>
        <label htmlFor="file">Datei</label>
        <input type="file" name="file"/>
        {/* <label htmlFor="name">Name</label>
        <input type="text" name="name" defaultValue={user?.name ?? ''} />
        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          cols={30}
          rows={10}
          defaultValue={user?.bio ?? ''}
        ></textarea>
        <label htmlFor="age">Age</label>
        <input type="text" name="age" defaultValue={user?.age ?? 0} />
        <label htmlFor="image">Profile Image URL</label>
        <input type="text" name="image" defaultValue={user?.image ?? ''} /> */}

        <button type="submit">Save</button>
      </form>
    </div>
  );
}