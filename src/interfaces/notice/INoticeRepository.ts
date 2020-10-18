export default interface INoticeRepository {
  addNotice(adminId: string, category: string, content: string): Promise<void>;
}
