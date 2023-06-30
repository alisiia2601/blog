import supabase from '@/lib/supabaseClient';

export const uploadImage = async (file) => {
  const fullFileName = file.name.split('.');
  const fileName = fullFileName[0];
  const fileExt = fullFileName[1];

  //detta räcker för vårt projekt för unikt namn
  const filePath = `${fileName}-${Math.random()}.${fileExt}`;

  //UPLOAD image to bucket
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { error };
  }

  //GET image path from bucket
  const {
    data: { publicUrl },
    error: publicUrlError,
  } = await supabase.storage.from('images').getPublicUrl(data.path);

  if (publicUrlError) {
    return { error: publicUrlError };
  }

  //console.log({ data });

  //RETURN image url to client
  return { error: false, publicUrl };
};