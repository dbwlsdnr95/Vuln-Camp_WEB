package com.vulnlab.web.config;

import com.vulnlab.web.model.Card;
import com.vulnlab.web.model.Order;
import com.vulnlab.web.model.Product;
import com.vulnlab.web.model.User;
import com.vulnlab.web.model.Qna;
import com.vulnlab.web.repository.CardRepository;
import com.vulnlab.web.repository.OrderRepository;
import com.vulnlab.web.repository.ProductRepository;
import com.vulnlab.web.repository.UserRepository;
import com.vulnlab.web.repository.NoticeRepository;
import com.vulnlab.web.repository.QnaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final OrderRepository orderRepository;
        private final CardRepository cardRepository;
        private final NoticeRepository noticeRepository;
        private final QnaRepository qnaRepository;

        public DataInitializer(UserRepository userRepository, ProductRepository productRepository,
                        OrderRepository orderRepository, CardRepository cardRepository,
                        NoticeRepository noticeRepository, QnaRepository qnaRepository) {
                this.userRepository = userRepository;
                this.productRepository = productRepository;
                this.orderRepository = orderRepository;
                this.cardRepository = cardRepository;
                this.noticeRepository = noticeRepository;
                this.qnaRepository = qnaRepository;
        }

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                // Seeding Users/Products/Orders (Only if empty)
                if (userRepository.count() == 0) {
                        // 1. Users
                        User realAdmin = new User("admin@vuln.camp", "admin123$");
                        userRepository.save(realAdmin);

                        // 2. Products
                        Product p1 = new Product("Amenity Dome M", 468000,
                                        "https://www.snowpeak.co.kr/upload/product/opt/202003/20200305_130548_97719.jpg");
                        Product p2 = new Product("Living Shell", 1480000,
                                        "https://www.snowpeak.co.kr/upload/product/opt/201901/20190111_160356_53523.jpg");
                        Product p3 = new Product("Takibi Fire & Grill", 289000,
                                        "https://www.snowpeak.co.kr/upload/product/opt/201901/20190111_143004_11068.jpg");
                        Product p4 = new Product("Home & Camp Burner", 138000,
                                        "https://www.snowpeak.co.kr/upload/product/opt/201907/20190710_091024_17409.jpg");
                        productRepository.save(p1);
                        productRepository.save(p2);
                        productRepository.save(p3);
                        productRepository.save(p4);

                        // 3. Cards
                        Card c1 = new Card("admin", "1234-5678-1234-5678", "123", "12/25");
                        Card c2 = new Card("user1", "1111-2222-3333-4444", "456", "01/26");
                        cardRepository.save(c1);
                        cardRepository.save(c2);

                        // 4. Orders
                        Order o1 = new Order("admin", "Amenity Dome M", 468000, p1.getImageUrl());
                        Order o2 = new Order("user1", "Living Shell", 1480000, p2.getImageUrl());
                        orderRepository.save(o1);
                        orderRepository.save(o2);

                        System.out.println("Main Database seeded with mock data!");
                }

                // 5. Notices
                if (noticeRepository.count() == 0) {
                        com.vulnlab.web.model.Notice n1 = new com.vulnlab.web.model.Notice();
                        n1.setTitle("서비스 점검 안내 (12/25)");
                        n1.setContent("크리스마스 서버 점검이 예정되어 있습니다. 이용에 불편을 드려 죄송합니다.");
                        n1.setAuthor("admin@vuln.camp");
                        noticeRepository.save(n1);

                        com.vulnlab.web.model.Notice n2 = new com.vulnlab.web.model.Notice();
                        n2.setTitle("개인정보 처리방침 변경 안내");
                        n2.setContent("2024년 1월 1일부로 개인정보 처리방침이 변경됩니다. 확인 부탁드립니다.");
                        n2.setAuthor("admin@vuln.camp");
                        noticeRepository.save(n2);

                        System.out.println("Notices seeded!");
                }

                // 6. QnA (For SQL Injection testing)
                // If specific seed data is missing, add it (even if other posts exist)
                if (!qnaRepository.existsByTitle("배송 언제 오나요?")) {
                        String[] titles = {
                                        "배송 언제 오나요?",
                                        "환불하고 싶습니다.",
                                        "상품이 파손되어 왔어요 ㅠㅠ",
                                        "로그인이 자꾸 풀립니다.",
                                        "재입고 일정 문의드려요",
                                        "결제가 계속 실패합니다."
                        };

                        for (int i = 0; i < titles.length; i++) {
                                Qna q = new Qna();
                                q.setTitle(titles[i]);
                                q.setContent("확인 부탁드립니다. (" + (i + 1) + ")");
                                q.setAuthor("user1");
                                qnaRepository.save(q);
                        }

                        System.out.println("6 QnA posts seeded for testing!");
                }

                // 7. QnA for Path Traversal testing
                if (!qnaRepository.existsByTitle("파일 다운로드 취약점 테스트")) {
                        Qna q = new Qna();
                        q.setTitle("파일 다운로드 취약점 테스트");
                        q.setContent("이 게시글의 첨부파일을 통해 Path Traversal 및 다운로드 취약점을 테스트할 수 있습니다.");
                        q.setAuthor("admin@vuln.camp");
                        q.setAttachmentPath("test-download.txt");
                        q.setStatus("Completed");
                        qnaRepository.save(q);
                        System.out.println("Path Traversal test QnA seeded!");
                }
        }
}
