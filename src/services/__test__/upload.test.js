import { UploadService } from '../upload.js';
import imagekit from '../../config/imagekit.js';

jest.mock('../../config/imagekit.js');

describe('UploadService', () => {
  describe('upload', () => {
    it('should upload files successfully', async () => {
      const mockFiles = {
        image: [
          {
            originalname: 'test.jpg',
            buffer: Buffer.from('mockBuffer'),
          },
        ],
      };
      const mockFolder = 'testFolder';
      const mockTags = ['testTag'];
      const mockUploadedFile = {
        fileId: 'mockFileId',
        name: 'image-1234567890.jpg',
      };

      imagekit.upload.mockResolvedValue(mockUploadedFile);

      const result = await UploadService.upload(
        mockFiles,
        mockFolder,
        mockTags
      );

      expect(imagekit.upload).toHaveBeenCalledWith({
        folder: mockFolder,
        tags: mockTags,
        file: mockFiles.image[0].buffer,
        fileName: expect.stringMatching(/^image-\d+\.jpg$/),
      });
      expect(result).toEqual({ image: mockUploadedFile });
    });

    it('should return null if no files are provided', async () => {
      const mockFiles = {};
      const mockFolder = 'testFolder';
      const mockTags = ['testTag'];

      const result = await UploadService.upload(
        mockFiles,
        mockFolder,
        mockTags
      );

      expect(result).toEqual({ image: null });
      expect(imagekit.upload).not.toHaveBeenCalled();
    });

    it('should throw an error if upload fails', async () => {
      const mockFiles = {
        image: [
          {
            originalname: 'test.jpg',
            buffer: Buffer.from('mockBuffer'),
          },
        ],
      };
      const mockFolder = 'testFolder';
      const mockTags = ['testTag'];
      const mockError = new Error('Upload error');

      imagekit.upload.mockRejectedValue(mockError);

      await expect(
        UploadService.upload(mockFiles, mockFolder, mockTags)
      ).rejects.toThrow('Upload error');
    });
  });

  describe('delete', () => {
    it('should delete a file successfully', async () => {
      const mockFileID = 'mockFileId';
      const mockResult = { success: true };

      imagekit.deleteFile.mockResolvedValue(mockResult);

      const result = await UploadService.delete(mockFileID);

      expect(imagekit.deleteFile).toHaveBeenCalledWith(mockFileID);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if file ID is not provided', async () => {
      await expect(UploadService.delete()).rejects.toThrow(
        'File ID is required'
      );
    });

    it('should throw an error if delete fails', async () => {
      const mockFileID = 'mockFileId';
      const mockError = new Error('Delete error');

      imagekit.deleteFile.mockRejectedValue(mockError);

      await expect(UploadService.delete(mockFileID)).rejects.toThrow(
        'Delete error'
      );
    });
  });
});
