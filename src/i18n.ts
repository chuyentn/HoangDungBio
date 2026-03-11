import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  vi: {
    translation: {
      nav: {
        solutions: "Giải pháp",
        products: "Sản phẩm",
        carbonloop: "CarbonLoop",
        projects: "Dự án",
        contact: "Liên hệ",
        getQuote: "Báo giá ngay",
        crmDashboard: "Dashboard CRM",
        login: "Đăng nhập",
        logout: "Đăng xuất"
      },
      hero: {
        badge: "Giải pháp nhiên liệu Net Zero",
        title: "Năng Lượng Xanh",
        subtitle: "Cho Tương Lai Bền Vững",
        description: "Hoàng Dung Biomass cung cấp hệ sinh thái giải pháp năng lượng sinh khối toàn diện, giúp doanh nghiệp tối ưu chi phí và đạt mục tiêu Net Zero.",
        cta1: "Khám phá giải pháp",
        cta2: "Tư vấn CarbonLoop™"
      },
      challenges: {
        tag: "Thách thức năng lượng",
        title: "Doanh nghiệp của bạn đang đối mặt với áp lực gì?",
        item1: {
          title: "Chi phí nhiên liệu tăng vọt",
          desc: "Giá than và dầu FO/DO biến động mạnh, ảnh hưởng trực tiếp đến biên lợi nhuận."
        },
        item2: {
          title: "Áp lực phát thải Carbon",
          desc: "Các quy định về Net Zero và thuế Carbon đang trở thành rào cản xuất khẩu."
        },
        item3: {
          title: "Hiệu suất lò hơi thấp",
          desc: "Hệ thống cũ kỹ, tiêu hao nhiều năng lượng nhưng hiệu quả sinh nhiệt không cao."
        },
        stats: {
          value: "-40%",
          label: "Chi phí năng lượng",
          quote: "\"Giải pháp của HDB giúp chúng tôi tiết kiệm hàng tỷ đồng mỗi năm.\""
        }
      },
      ecoloop: {
        tag: "EcoLoop™ Supply",
        title: "Nguồn Nhiên Liệu Xanh Ổn Định",
        description: "Chúng tôi cung cấp đa dạng các loại nhiên liệu sinh khối với quy trình kiểm soát chất lượng nghiêm ngặt, đảm bảo nhiệt trị và độ ẩm tối ưu."
      },
      form: {
        title: "Đăng ký tư vấn",
        fullName: "Họ và tên",
        phone: "Số điện thoại",
        company: "Tên công ty",
        email: "Email doanh nghiệp",
        boilerCapacity: "Công suất lò hơi (Tấn/h)",
        fuelConsumption: "Tiêu thụ nhiên liệu (Tấn/tháng)",
        service: "Dịch vụ quan tâm",
        other: "Khác (Vui lòng ghi rõ)",
        submit: "Gửi yêu cầu báo giá",
        success: "Cảm ơn bạn! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại sớm nhất.",
        error: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline."
      },
      footer: {
        description: "Hoàng Dung Biomass là đơn vị tiên phong trong lĩnh vực giải pháp năng lượng sinh khối tại Việt Nam, cam kết đồng hành cùng doanh nghiệp hướng tới tương lai Net Zero.",
        solutions: "Giải pháp",
        support: "Hỗ trợ",
        address: "Đồng Nai, Việt Nam",
        contactSupport: "Liên hệ hỗ trợ",
        quote: "Yêu cầu báo giá",
        datasheet: "Tài liệu kỹ thuật",
        faq: "Câu hỏi thường gặp",
        rights: "© 2024 Hoàng Dung Biomass. Bảo lưu mọi quyền."
      },
      products: {
        woodPellets: {
          name: "Viên nén mùn cưa (Wood Pellets)",
          desc: "Nhiên liệu sinh khối chất lượng cao, độ tro thấp, nhiệt trị ổn định cho lò hơi công nghiệp."
        },
        riceHuskPellets: {
          name: "Viên nén củi trấu (Rice Husk Pellets)",
          desc: "Giải pháp tận dụng phế phẩm nông nghiệp, chi phí tối ưu cho các nhà máy khu vực ĐBSCL."
        },
        cashewShellCake: {
          name: "Bã vỏ hạt điều (Cashew Shell Cake)",
          desc: "Nhiệt trị cực cao, phù hợp cho các hệ thống đốt cần công suất nhiệt lớn."
        },
        specs: {
          calorific: "Nhiệt trị",
          moisture: "Độ ẩm",
          ash: "Độ tro"
        },
        status: "Sẵn hàng",
        details: "Xem chi tiết"
      },
      projects: {
        title: "Dự Án Tiêu Biểu",
        tag: "Thành công thực tế",
        viewAll: "Xem tất cả dự án",
        result: "Kết quả",
        tags: {
          carbonloop: "CarbonLoop",
          woodPellets: "Viên nén mùn cưa",
          energyAudit: "Kiểm toán năng lượng",
          ecoloop: "EcoLoop"
        },
        paperMill: {
          title: "Chuyển đổi lò hơi than sang Biomass cho nhà máy Giấy",
          client: "Nhà máy Giấy tại Bình Dương",
          result: "Giảm 35% chi phí vận hành & 100% phát thải lưu huỳnh."
        },
        foodProcessing: {
          title: "Tối ưu hóa hiệu suất nhiệt cho tập đoàn Thực phẩm",
          client: "Tập đoàn Thực phẩm đa quốc gia",
          result: "Tăng 15% hiệu suất đốt, giảm tiêu hao nhiên liệu."
        }
      },
      carbonloop: {
        tag: "Dịch vụ CarbonLoop™",
        title: "Lộ trình Net Zero cho doanh nghiệp",
        description: "Chúng tôi không chỉ bán nhiên liệu, chúng tôi đồng hành cùng bạn trong hành trình chuyển đổi năng lượng bền vững.",
        services: [
          { title: "Kiểm toán năng lượng", desc: "Đánh giá hiện trạng tiêu thụ và tiềm năng tiết kiệm." },
          { title: "Tư vấn chuyển đổi", desc: "Thiết kế giải pháp thay thế than/dầu bằng sinh khối." },
          { title: "Tối ưu hóa lò hơi", desc: "Cân chỉnh hệ thống để đạt hiệu suất nhiệt cao nhất." },
          { title: "Lộ trình Net Zero", desc: "Xây dựng chiến lược giảm phát thải dài hạn." }
        ],
        whyChoose: {
          title: "Tại sao chọn HDB?",
          items: [
            { label: "Kinh nghiệm", value: "15+ Năm trong ngành năng lượng" },
            { label: "Mạng lưới", value: "Hệ thống kho bãi khắp Việt Nam" },
            { label: "Công nghệ", value: "Đội ngũ kỹ sư chuyên môn cao" },
            { label: "Cam kết", value: "Đảm bảo nguồn cung 24/7" }
          ]
        }
      },
      contactSection: {
        title: "Sẵn sàng chuyển đổi sang năng lượng sạch?",
        description: "Để lại thông tin, đội ngũ chuyên gia của chúng tôi sẽ liên hệ tư vấn giải pháp tối ưu nhất cho nhà máy của bạn."
      },
      hub: {
        tag: "Project Hub",
        title: "Trung tâm Tài liệu & Cộng tác",
        description: "Xem Project Brief, để lại nhận xét và chia sẻ với đội ngũ chuyên gia HDB để cùng hoàn thiện lộ trình Net Zero của bạn.",
        share: "Chia sẻ",
        liveEditing: "Đang chỉnh sửa trực tiếp",
        discussion: "Thảo luận",
        writeComment: "Viết nhận xét...",
        shareRights: "Chia sẻ quyền chỉnh sửa",
        shareDescription: "Mời đối tác hoặc đồng nghiệp cùng tham gia xây dựng Project Brief.",
        inviteEmail: "Mời qua Email",
        copyLink: "Sao chép liên kết",
        loginToComment: "Vui lòng đăng nhập để tham gia thảo luận",
        justNow: "Vừa xong",
        confirmComment: "Bạn có chắc chắn muốn đăng nhận xét này?",
        confirmDeleteComment: "Bạn có chắc chắn muốn xóa nhận xét này?",
        tasks: "Nhiệm vụ dự án",
        addTask: "Thêm nhiệm vụ",
        taskTitle: "Tên nhiệm vụ",
        dueDate: "Hạn chót",
        status: "Trạng thái",
        overdue: "Quá hạn",
        upcoming: "Sắp tới",
        completed: "Hoàn thành",
        all: "Tất cả",
        filter: "Lọc",
        edit: "Sửa",
        delete: "Xóa",
        confirmDelete: "Bạn có chắc chắn muốn xóa nhiệm vụ này?",
        save: "Lưu",
        cancel: "Hủy",
        content: {
          title: "Nền tảng Bán hàng B2B Kỹ thuật số cho Hoàng Dung Biomass",
          section1Title: "1. WHY – Tại sao phải triển khai dự án này",
          section1Text: "Hoàng Dung Biomass (HDB) đang chuyển từ mô hình Trading truyền thống sang B2B Energy Solution Platform.",
          section1Items: [
            "Xây dựng uy tín chuyên gia trong lĩnh vực Net Zero Fuel Solutions",
            "Tạo kênh bán hàng B2B tự động 24/7",
            "Thu thập lead chất lượng cao để đội sales chốt hợp đồng."
          ],
          section2Title: "2. WHO – Đối tượng khách hàng",
          section2Text: "Website hướng tới khách hàng công nghiệp sử dụng lò hơi hoặc năng lượng nhiệt.",
          section2Comment: "Nhận xét từ Energy Manager: \"Cần bổ sung thêm nhóm nhà máy dệt nhuộm tại khu vực miền Nam.\"",
          section3Title: "3. WHAT – HDB cung cấp gì",
          section4Title: "4. WEBSITE MISSION",
          section4Text: "Website phải làm được 4 việc: Thể hiện chuyên môn, Thuyết phục khách hàng, Cho khách tự tìm hiểu, và Request quotation.",
          comments: [
            { user: 'Admin HDB', text: 'Đã cập nhật lộ trình CarbonLoop mới nhất.', time: '10 phút trước' },
            { user: 'Khách hàng A', text: 'Tôi muốn xem thêm bảng so sánh nhiệt trị.', time: '1 giờ trước' },
            { user: 'Consultant', text: 'Đã thêm phần Case Study nhà máy giấy.', time: '3 giờ trước' }
          ]
        }
      },
      global: {
        tag: "Global B2B Platform",
        title: "Kết nối Năng lượng Xanh Toàn cầu",
        description: "Hệ thống cung ứng của HDB đã sẵn sàng phục vụ các thị trường quốc tế với tiêu chuẩn chất lượng khắt khe nhất. Chúng tôi hỗ trợ doanh nghiệp toàn cầu tối ưu hóa chi phí năng lượng và đạt mục tiêu ESG.",
        countries: "Quốc gia xuất khẩu",
        capacity: "Tấn/năm công suất",
        inquiryTitle: "Yêu cầu Tư vấn Quốc tế",
        inquiryDescription: "Dành cho các đối tác ngoài lãnh thổ Việt Nam muốn tìm hiểu về giải pháp EcoLoop™.",
        contactSales: "Liên hệ Đội ngũ Global Sales"
      },
      calculator: {
        title: "Công cụ tính toán tiết kiệm",
        subtitle: "Ước tính mức tiết kiệm khi chuyển đổi sang nhiên liệu sinh khối",
        currentFuel: "Nhiên liệu hiện tại",
        monthlyConsumption: "Tiêu thụ hàng tháng (Tấn)",
        currentPrice: "Giá hiện tại (VNĐ/kg)",
        calculate: "Tính toán kết quả",
        results: "Kết quả ước tính",
        annualSavings: "Tiết kiệm hàng năm",
        co2Reduction: "Giảm phát thải CO2",
        roi: "Thời gian hoàn vốn ước tính",
        contactForAudit: "Đăng ký kiểm toán năng lượng chi tiết",
        disclaimer: "* Kết quả chỉ mang tính chất tham khảo dựa trên giá thị trường trung bình.",
        fuels: {
          coal: "Than đá",
          oil: "Dầu FO/DO",
          biomass: "Củi/Trấu (Tối ưu hóa)"
        }
      },
      library: {
        title: "Thư viện Tài liệu Kỹ thuật",
        description: "Tải xuống các tài liệu chuyên sâu về giải pháp năng lượng sinh khối và lộ trình giảm phát thải Carbon.",
        downloadNow: "Tải xuống ngay"
      },
      formFields: {
        currentFuel: "Nhiên liệu hiện tại",
        consultationNeed: "Nhu cầu tư vấn",
        placeholderName: "Nguyễn Văn A",
        placeholderCompany: "Công ty TNHH Sản xuất ABC",
        placeholderCapacity: "Tấn/giờ",
        placeholderConsultation: "Mô tả ngắn gọn nhu cầu của bạn...",
        fuelOptions: {
          coal: "Than đá",
          oil: "Dầu FO/DO",
          biomass: "Củi/Củi trấu",
          other: "Khác"
        },
        emailTitle: "Vui lòng nhập địa chỉ email hợp lệ (ví dụ: name@company.com)",
        phoneTitle: "Số điện thoại chỉ bao gồm chữ số và có thể bắt đầu bằng dấu '+'"
      }
    }
  },
  en: {
    translation: {
      nav: {
        solutions: "Solutions",
        products: "Products",
        carbonloop: "CarbonLoop",
        projects: "Projects",
        contact: "Contact",
        getQuote: "Get Quote",
        crmDashboard: "CRM Dashboard",
        login: "Login",
        logout: "Logout"
      },
      hero: {
        badge: "Net Zero Fuel Solutions",
        title: "Green Energy",
        subtitle: "For a Sustainable Future",
        description: "Hoàng Dung Biomass provides a comprehensive biomass energy ecosystem, helping businesses optimize costs and achieve Net Zero goals.",
        cta1: "Explore Solutions",
        cta2: "CarbonLoop™ Consulting"
      },
      challenges: {
        tag: "Energy Challenges",
        title: "What pressures is your business facing?",
        item1: {
          title: "Skyrocketing Fuel Costs",
          desc: "Coal and oil prices fluctuate sharply, directly impacting profit margins."
        },
        item2: {
          title: "Carbon Emission Pressure",
          desc: "Net Zero regulations and Carbon taxes are becoming export barriers."
        },
        item3: {
          title: "Low Boiler Efficiency",
          desc: "Old systems consume a lot of energy but have low heat generation efficiency."
        },
        stats: {
          value: "-40%",
          label: "Energy Costs",
          quote: "\"HDB's solutions help us save billions of VND every year.\""
        }
      },
      ecoloop: {
        tag: "EcoLoop™ Supply",
        title: "Stable Green Fuel Source",
        description: "We provide a variety of biomass fuels with strict quality control processes, ensuring optimal calorific value and moisture."
      },
      form: {
        title: "Consultation Request",
        fullName: "Full Name",
        phone: "Phone Number",
        company: "Company Name",
        email: "Business Email",
        boilerCapacity: "Boiler Capacity (Tons/h)",
        fuelConsumption: "Fuel Consumption (Tons/month)",
        service: "Service of Interest",
        other: "Other (Please specify)",
        submit: "Send Quote Request",
        success: "Thank you! We have received your request and will contact you shortly.",
        error: "An error occurred while sending the request. Please try again later or contact our hotline directly."
      },
      footer: {
        description: "Hoàng Dung Biomass is a pioneer in the field of biomass energy solutions in Vietnam, committed to accompanying businesses towards a Net Zero future.",
        solutions: "Solutions",
        support: "Support",
        address: "Dong Nai, Vietnam",
        contactSupport: "Contact Support",
        quote: "Request Quote",
        datasheet: "Technical Datasheet",
        faq: "FAQ",
        rights: "© 2024 Hoàng Dung Biomass. All rights reserved."
      },
      products: {
        woodPellets: {
          name: "Wood Pellets",
          desc: "High-quality biomass fuel, low ash, stable calorific value for industrial boilers."
        },
        riceHuskPellets: {
          name: "Rice Husk Pellets",
          desc: "Solution utilizing agricultural waste, optimal cost for factories in the Mekong Delta region."
        },
        cashewShellCake: {
          name: "Cashew Shell Cake",
          desc: "Extremely high calorific value, suitable for combustion systems requiring large heat capacity."
        },
        specs: {
          calorific: "Calorific Value",
          moisture: "Moisture",
          ash: "Ash Content"
        },
        status: "In Stock",
        details: "View Details"
      },
      projects: {
        title: "Featured Projects",
        tag: "Real Success",
        viewAll: "View All Projects",
        result: "Result",
        tags: {
          carbonloop: "CarbonLoop",
          woodPellets: "Wood Pellets",
          energyAudit: "Energy Audit",
          ecoloop: "EcoLoop"
        },
        paperMill: {
          title: "Converting Coal Boiler to Biomass for Paper Mill",
          client: "Paper Mill in Binh Duong",
          result: "Reduced 35% operating costs & 100% sulfur emissions."
        },
        foodProcessing: {
          title: "Optimizing Thermal Efficiency for Food Group",
          client: "Multinational Food Group",
          result: "Increased 15% combustion efficiency, reduced fuel consumption."
        }
      },
      carbonloop: {
        tag: "CarbonLoop™ Services",
        title: "Net Zero Roadmap for Businesses",
        description: "We don't just sell fuel, we accompany you in the journey of sustainable energy transformation.",
        services: [
          { title: "Energy Audit", desc: "Evaluate current consumption and saving potential." },
          { title: "Conversion Consulting", desc: "Design solutions to replace coal/oil with biomass." },
          { title: "Boiler Optimization", desc: "Align systems to achieve the highest thermal efficiency." },
          { title: "Net Zero Roadmap", desc: "Build long-term emission reduction strategies." }
        ],
        whyChoose: {
          title: "Why choose HDB?",
          items: [
            { label: "Experience", value: "15+ Years in energy industry" },
            { label: "Network", value: "Warehouse system across Vietnam" },
            { label: "Technology", value: "Highly specialized engineering team" },
            { label: "Commitment", value: "Ensure 24/7 supply" }
          ]
        }
      },
      contactSection: {
        title: "Ready to switch to clean energy?",
        description: "Leave your information, our team of experts will contact you to advise on the most optimal solution for your factory."
      },
      hub: {
        tag: "Project Hub",
        title: "Document & Collaboration Hub",
        description: "View Project Brief, leave comments and share with HDB expert team to complete your Net Zero roadmap.",
        share: "Share",
        liveEditing: "Live Editing",
        discussion: "Discussion",
        writeComment: "Write a comment...",
        shareRights: "Share editing rights",
        shareDescription: "Invite partners or colleagues to join in building the Project Brief.",
        inviteEmail: "Invite via Email",
        copyLink: "Copy Link",
        loginToComment: "Please login to join the discussion",
        justNow: "Just now",
        confirmComment: "Are you sure you want to post this comment?",
        confirmDeleteComment: "Are you sure you want to delete this comment?",
        tasks: "Project Tasks",
        addTask: "Add Task",
        taskTitle: "Task Title",
        dueDate: "Due Date",
        status: "Status",
        overdue: "Overdue",
        upcoming: "Upcoming",
        completed: "Completed",
        all: "All",
        filter: "Filter",
        edit: "Edit",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this task?",
        save: "Save",
        cancel: "Cancel",
        content: {
          title: "Digital B2B Sales Platform for Hoang Dung Biomass",
          section1Title: "1. WHY – Why implement this project",
          section1Text: "Hoang Dung Biomass (HDB) is transitioning from a traditional Trading model to a B2B Energy Solution Platform.",
          section1Items: [
            "Build expert credibility in Net Zero Fuel Solutions",
            "Create 24/7 automated B2B sales channel",
            "Collect high-quality leads for the sales team to close deals."
          ],
          section2Title: "2. WHO – Target customers",
          section2Text: "The website targets industrial customers using boilers or thermal energy.",
          section2Comment: "Comment from Energy Manager: \"Need to add the textile and dyeing factory group in the Southern region.\"",
          section3Title: "3. WHAT – What HDB provides",
          section4Title: "4. WEBSITE MISSION",
          section4Text: "The website must do 4 things: Demonstrate expertise, Persuade customers, Allow self-research, and Request quotation.",
          comments: [
            { user: 'Admin HDB', text: 'Updated the latest CarbonLoop roadmap.', time: '10 minutes ago' },
            { user: 'Customer A', text: 'I want to see more calorific value comparison tables.', time: '1 hour ago' },
            { user: 'Consultant', text: 'Added the paper mill Case Study section.', time: '3 hours ago' }
          ]
        }
      },
      global: {
        tag: "Global B2B Platform",
        title: "Connecting Global Green Energy",
        description: "HDB's supply system is ready to serve international markets with the strictest quality standards. We support global businesses in optimizing energy costs and achieving ESG goals.",
        countries: "Export Countries",
        capacity: "Tons/year capacity",
        inquiryTitle: "International Consultation Request",
        inquiryDescription: "For partners outside Vietnam who want to learn about EcoLoop™ solutions.",
        contactSales: "Contact Global Sales Team"
      },
      calculator: {
        title: "Savings Calculator",
        subtitle: "Estimate your savings when switching to biomass fuel",
        currentFuel: "Current Fuel Type",
        monthlyConsumption: "Monthly Consumption (Tons)",
        currentPrice: "Current Price (VND/kg)",
        calculate: "Calculate Results",
        results: "Estimated Results",
        annualSavings: "Annual Savings",
        co2Reduction: "CO2 Reduction",
        roi: "Estimated ROI Period",
        contactForAudit: "Register for Detailed Energy Audit",
        disclaimer: "* Results are for reference only based on average market prices.",
        fuels: {
          coal: "Coal",
          oil: "FO/DO Oil",
          biomass: "Biomass (Optimized)"
        }
      },
      library: {
        title: "Technical Document Library",
        description: "Download in-depth documents on biomass energy solutions and Carbon emission reduction roadmap.",
        downloadNow: "Download Now"
      },
      formFields: {
        currentFuel: "Current Fuel",
        consultationNeed: "Consultation Need",
        placeholderName: "John Doe",
        placeholderCompany: "ABC Manufacturing Co., Ltd",
        placeholderCapacity: "Tons/hour",
        placeholderConsultation: "Briefly describe your needs...",
        fuelOptions: {
          coal: "Coal",
          oil: "FO/DO Oil",
          biomass: "Wood/Rice Husk",
          other: "Other"
        },
        emailTitle: "Please enter a valid email address (e.g., name@company.com)",
        phoneTitle: "Phone number only includes digits and can start with '+'"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
