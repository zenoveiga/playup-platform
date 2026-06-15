<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $users = [
            [
                'name' => 'First Test User',
                'email' => 'firsttestuser@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Admin User',
                'email' => 'admin@playup.com',
                'role' => 'admin',
            ],
            [
                'name' => 'School Admin User',
                'email' => 'school@playup.com',
                'role' => 'school_admin',
            ],
            [
                'name' => 'Ricardo Oliveira Almeida',
                'email' => 'ricardo.almeida@gmail.com',
                'phone' => '(11) 98822-1244',
                'status' => 'active',
                'role' => 'student',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgGge0hAlx19CFGJic5KFvG8Gg7zxCOIoQ-wFUQI7W_ed7UcdpO2ELNf4_5ukkdm0kVKtGeYGAhJTbpOqxBRDQf4TTn7LRKsnc1xejHk3yXRE7h33m2B4PpxWY_eQYll5DAKFdtXRhoZeihSFBIZsNfHQ_j8omSxZ8FcqLJScTI4-8oGjlSd3alfg1sMX4wTrV0yiCLGeKIR_wZWXvIIH1lEmpbrOxDV08OHoYiB58VOnenJgr3tkN2SdsOiPdUmhmBCkVa8L6FW0j',
            ],
            [
                'name' => 'Beatriz Santos Pereira',
                'email' => 'beatriz.santos@outlook.com',
                'phone' => '(21) 97711-5588',
                'status' => 'active',
                'role' => 'student',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOTnDP3RY1P1SsK9_iugAx0KVqNyBih4k-36CvptV9lFULzbbf0XctPvlya-Odc8xyGRJ-FgwYIqjd608OK4N2BCFqwM7bNteTxuwzGu-rhzjwlMIqESTQJVPQHUMA6LhAbIsCMwG_zb4WxaqtiBm0UflwNK1LbaJcjubwlqq0SP2QImwS4k9gAxZnQstlFvYRsX8khQndV4pYiGOT7aBb0dKobE2YZn8TcqAitYtN2Q_pOo-s5seVoaMi1nu3bqip6s4bJXc7JZOz',
            ],
            [
                'name' => 'Lucas Ferreira Lima',
                'email' => 'lucas.ferreira@gmail.com',
                'phone' => '(31) 99223-4455',
                'status' => 'inactive',
                'role' => 'student',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUwxdNBAYe5Mg9K4csyYmWuRWEFtocKFv6RQrPoxBNVbztynFuy5bL9lppdEDwvmkKvPPJ2AQj5Dm86XkTZJoz4hJ3dohuUwn7byhgzqazkHeCXP9ZS_u-LyTjIsJv6U1ZCuKy-77lcAO9A2CsAQ7QwaX7XUOfg2Dk4PuEllMsg2GCESt448Fn0PhNreNJ_RxmhJx1iXAQxd5bPZnU3TUzx5MFsiK2fNNkoPNJlj3nyXHZg5HWIkWyOATqGTy-OwSsMrcSLeIw8ERy',
            ],
            [
                'name' => 'Mariana Costa',
                'email' => 'm.costa@empresa.com.br',
                'phone' => '(11) 97755-1100',
                'status' => 'active',
                'role' => 'student',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BDP_V4pMIhL7udSAgk26C32OdR5hAmfFWhEGknLUW7NNTI4MSIJMjMEnozKGpk3X3nrujop5ZbXsBg-c_BpOrz3vppLHCtQfEuKIZ0VfWO9MpX8ptAJOc_XWc_QhXbkM3DKRv690MQpLxaUO1DqgR8vKxTKXuRH1Ua1iF5Qe99adXnZgj0xQ_XYM5IgyqWkwaBZeeqlLTurtLvoXNftlxRHsrdhaHXLLNa2lJBrz8CA1ffIvHyzFQLpXbLBe3tW0KvAikt1zx4V0',
            ],
            [
                'name' => 'Guilherme Silva Souza',
                'email' => 'guilherme.souza@gmail.com',
                'phone' => '(11) 98877-2233',
                'status' => 'active',
                'role' => 'student',
            ],
            [
                'name' => 'Ana Paula Santos',
                'email' => 'ana.santos@gmail.com',
                'phone' => '(11) 97766-3344',
                'status' => 'inactive',
                'role' => 'student',
            ]
        ];

        foreach ($users as $userData) {
            if (User::where('email', $userData['email'])->doesntExist()) {
                User::factory()->create($userData);
            }
        }

        $polos = [
            [
                'code' => 'PL-001',
                'name' => 'Polo São Paulo Jardins',
                'responsible' => 'Ricardo Mendes',
                'phone' => '(11) 98877-6655',
                'email' => 'jardins@playup.com',
                'address' => 'Alameda Lorena, 1500, Jardins, São Paulo - SP',
                'status' => 'active',
                'active_students' => 452,
                'capacity_pct' => 90,
            ],
            [
                'code' => 'PL-002',
                'name' => 'Polo Rio Centro',
                'responsible' => 'Beatriz Pereira',
                'phone' => '(21) 97766-5544',
                'email' => 'riocentro@playup.com',
                'address' => 'Av. das Américas, 5000, Barra da Tijuca, Rio de Janeiro - RJ',
                'status' => 'active',
                'active_students' => 310,
                'capacity_pct' => 75,
            ],
            [
                'code' => 'PL-003',
                'name' => 'Polo Curitiba Central',
                'responsible' => 'Guilherme Souza',
                'phone' => '(41) 99988-7766',
                'email' => 'curitiba@playup.com',
                'address' => 'Rua XV de Novembro, 100, Centro, Curitiba - PR',
                'status' => 'active',
                'active_students' => 215,
                'capacity_pct' => 60,
            ],
            [
                'code' => 'PL-004',
                'name' => 'Polo Belo Horizonte',
                'responsible' => 'Ana Paula Santos',
                'phone' => '(31) 98855-4433',
                'email' => 'bh@playup.com',
                'address' => 'Av. Afonso Pena, 1200, Centro, Belo Horizonte - MG',
                'status' => 'inactive',
                'active_students' => 180,
                'capacity_pct' => 45,
            ],
            [
                'code' => 'PL-005',
                'name' => 'Polo Porto Alegre',
                'responsible' => 'Carlos Silveira',
                'phone' => '(51) 97744-3322',
                'email' => 'portoalegre@playup.com',
                'address' => 'Av. Ipiranga, 6681, Partenon, Porto Alegre - RS',
                'status' => 'active',
                'active_students' => 290,
                'capacity_pct' => 80,
            ],
            [
                'code' => 'PL-006',
                'name' => 'Polo Recife Antigo',
                'responsible' => 'Marina Costa',
                'phone' => '(81) 99977-6655',
                'email' => 'recife@playup.com',
                'address' => 'Rua do Bom Jesus, 200, Recife Antigo, Recife - PE',
                'status' => 'active',
                'active_students' => 154,
                'capacity_pct' => 35,
            ]
        ];

        foreach ($polos as $poloData) {
            if (\App\Models\Polo::where('code', $poloData['code'])->doesntExist()) {
                \App\Models\Polo::create($poloData);
            }
        }
    }
}
