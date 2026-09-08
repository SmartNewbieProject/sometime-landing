/** Original Naver tables omitted by the upstream migration, read-only recovery.
 * Only fills still-empty sections; a future API repair always takes precedence.
 * Cells transcribed from the public HTML tables at sourceUrl on retrievedAt.
 */
type TableRecovery = {
  sourceUrl: string;
  retrievedAt: string;
  tables: Array<{ heading: string; followingBlock?: string; rows: string[][] }>;
};

export const NAVER_TABLE_RECOVERIES: Record<string, TableRecovery> = {
  // Published 2026-07-03 11:09 KST; retrieved 2026-09-08 KST.
  // Source table: SE-419f5c93-c052-4413-88cf-6ec9f124f5a3.
  // The first header contains only Naver's U+200B empty-cell placeholder.
  "naver-224335105946": {
    sourceUrl: "https://m.blog.naver.com/smartnewb/224335105946",
    retrievedAt: "2026-09-08",
    tables: [
      {
        heading: "## 대학생 소개팅 앱별 사진 공개 방식 비교",
        rows: [
          ["", "사진 공개형", "블라인드형", "비고"],
          ["썸타임", "O", "O", "선택 가능"],
          ["연픽", "X", "O", "사진 없이 이용"],
          ["클럽트웬티", "O", "X", "사진 공개형"],
          ["하루야", "X", "O", "사진 없이 이용"],
          ["두근두근캠퍼스", "O", "X", "매칭시 1:1 공개"],
          ["캠퍼스팅", "O", "X", "단계별 공개"],
        ],
      },
    ],
  },
  "naver-224351872159": {
    "sourceUrl": "https://m.blog.naver.com/smartnewb/224351872159",
    "retrievedAt": "2026-09-08",
    "tables": [
      {
        "heading": "## 행사 안내",
        "rows": [
          [
            "구분",
            "내용"
          ],
          [
            "일정",
            "8월 상시 모집중"
          ],
          [
            "진행 시간",
            "약 100분"
          ],
          [
            "장소",
            "대전 | 1984 술마시는 작업실 봉명점"
          ],
          [
            "참가 대상",
            "01년생~07년생 대학생 및 대학 관련자"
          ],
          [
            "신청 가능 대상",
            "재학, 휴학, 졸업, 자퇴 모두 신청 가능"
          ],
          [
            "모집 인원",
            "여성 4명, 남성 4명, 총 8명"
          ],
          [
            "진행 방식",
            "친구와 2인 1조로 2:2 대화 후, 1회 로테이션/3:3 과팅"
          ],
          [
            "포함 사항",
            "공식 진행 중 음식, 주류 또는 음료 포함"
          ],
          [
            "친구 동반 혜택",
            "친구와 함께 신청 시 참가비 1인 기준 5,000원 할인"
          ],
          [
            "안내 방식",
            "선정된 분께만 개별 안내"
          ]
        ]
      },
      {
        "heading": "## 주의사항",
        "followingBlock": "정리하면",
        "rows": [
          [
            "구분",
            "내용"
          ],
          [
            "2차 진행",
            "공식 행사 이후 2차 여부는 참가자분들이 자유롭게 결정하시면 됩니다. 썸타임은 2차를 별도로 진행하거나 관리하지 않습니다."
          ],
          [
            "추가 주문",
            "행사 진행 중 추가 주문은 불가능합니다."
          ],
          [
            "제공 음식",
            "음식과 주류 또는 음료는 공식 진행 예산 안에서 제공되며, 수량이 한정되어 있습니다. 개별적인 주문 및 결제도 제한됩니다."
          ],
          [
            "행사 기록",
            "운영 중 행사 진행 기록을 위해 운영자가 사진을 촬영할 수 있습니다."
          ],
          [
            "사진 사용",
            "촬영된 사진은 행사 기록용으로만 사용되며, 외부에 사용되는 경우 얼굴은 모두 가린 상태로 처리됩니다."
          ],
          [
            "참가 안내",
            "신청 후 선정된 분께만 개별 안내드립니다."
          ],
          [
            "친구 신청",
            "친구와 함께 신청하는 경우에도 두 분 모두 각자 신청서를 제출해야 합니다."
          ]
        ]
      }
    ]
  },
  "naver-224339278687": {
    "sourceUrl": "https://m.blog.naver.com/smartnewb/224339278687",
    "retrievedAt": "2026-09-08",
    "tables": [
      {
        "heading": "## 썸타임 VS 위피",
        "rows": [
          [
            "비교 기준",
            "썸타임",
            "위피"
          ],
          [
            "앱 방향",
            "대학생 전용 소개팅·미팅",
            "동네친구·소개팅·채팅"
          ],
          [
            "주요 타깃",
            "대학생, 20대 초반",
            "20대부터 더 넓은 연령대"
          ],
          [
            "만남 기준",
            "같은 지역·근처 학교 대학생",
            "위치 기반 주변 사람"
          ],
          [
            "인증",
            "학생증 인증, 전화번호 인증",
            "전화번호 인증 등"
          ],
          [
            "지인 노출",
            "지인 차단, 같은 학교·학과 제외",
            "연락처 기반 아는 사람 차단"
          ],
          [
            "대화 방식",
            "우편함, 1:1 채팅, 커뮤니티 쪽지",
            "채팅, 보이스톡, 관심사 기반 추천"
          ],
          [
            "부가 기능",
            "블라인드/사진 공개, 커뮤니티, 일본 매칭, 모먼트,타로, AI 상담 등",
            "홈 추천·동네약속·위픽·한일 매칭·플레이 등"
          ],
          [
            "추천 대상",
            "주변 대학생을 만나고 싶은 사람",
            "동네에서 사람을 넓게 만나고 싶은 사람"
          ]
        ]
      }
    ]
  },
  "naver-224335480066": {
    "sourceUrl": "https://m.blog.naver.com/smartnewb/224335480066",
    "retrievedAt": "2026-09-08",
    "tables": [
      {
        "heading": "## 클럽트웬티 VS 썸타임 비교",
        "rows": [
          [
            "비교 기준",
            "썸타임",
            "클럽트웬티"
          ],
          [
            "앱 방향",
            "대학생 소개팅 + 커뮤니티 + 부가 기능",
            "대학생 소개팅·미팅 중심"
          ],
          [
            "프로필 확인",
            "1:1 매칭 중심",
            "여러 프로필 탐색형"
          ],
          [
            "사진 공개 방식",
            "사진 공개 소개팅, 블라인드 소개팅 둘 다 가능",
            "사진 공개 소개팅"
          ],
          [
            "미팅",
            "있음",
            "있음"
          ],
          [
            "커뮤니티",
            "대학생 커뮤니티, 쪽지 기능 있음",
            "X"
          ],
          [
            "부가 기능",
            "일본 매칭, 커뮤니티, 쪽지 등",
            "소개팅, 미팅, 채팅 중심"
          ],
          [
            "추천 대상",
            "편하게 오래 써보고 싶은 사람",
            "빠르게 둘러보고 선택하는 재미를 원하는 사람"
          ]
        ]
      }
    ]
  },
  "naver-224327826621": {
    "sourceUrl": "https://m.blog.naver.com/smartnewb/224327826621",
    "retrievedAt": "2026-09-08",
    "tables": [
      {
        "heading": "## 3. 썸타임 vs 연픽 비교",
        "rows": [
          [
            "비교 기준",
            "썸타임",
            "연픽"
          ],
          [
            "앱 방향",
            "권역별 대학생 소개팅",
            "대학생 소개팅·미팅 중심"
          ],
          [
            "지역",
            "전국(내 지역 대학생만)",
            "수도권 중심"
          ],
          [
            "만남 방식",
            "소개팅, 커뮤니티, 쪽지",
            "소개팅, 미팅, 일일호프"
          ],
          [
            "얼굴 공개",
            "공개 매칭/블라인드 둘 다 가능",
            "얼굴 비공개 매칭"
          ],
          [
            "추천 대상",
            "수도권이 아니어도 가까운 학교 사람을 만나고 싶은 대학생",
            "사진 공개가 부담스러운 수도권 대학생"
          ]
        ]
      }
    ]
  }
};

export function recoverNaverTables(slug: string, content: string): string {
  const recovery = NAVER_TABLE_RECOVERIES[slug];
  if (!recovery) return content;
  let result = content;
  for (const table of recovery.tables) {
    const heading = table.heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const following = table.followingBlock?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const emptySection = new RegExp(`^${heading}\\s*\\n(?=##?\\s|(?![\\s\\S])${following ? `|${following}(?:\\n|$)` : ""})`, "m");
    const [header, ...rows] = table.rows;
    const row = (cells: string[]) => `| ${cells.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`;
    const markdown = [row(header), row(header.map(() => "---")), ...rows.map(row)].join("\n");
    result = result.replace(emptySection, () => `${table.heading}\n\n${markdown}\n\n[원문 표 복원](${recovery.sourceUrl}) · 원문에 게시된 당시 내용이며 현재 운영 현황과 다를 수 있습니다.\n\n`);
  }
  return result;
}
